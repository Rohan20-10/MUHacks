import os
import re
import subprocess
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("zayedupal/movie-genre-prediction_bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("zayedupal/movie-genre-prediction_bert-base-uncased")

def extract_subtitles_from_srt(file_path):
    """Extracts subtitle entries with timestamps."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match subtitle blocks using regex
    pattern = re.compile(r"(\d+)\n(\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3})\n(.*?)\n\n", re.DOTALL)
    matches = pattern.findall(content)

    # Process matches into a list of dictionaries
    subtitles = [
        {"index": int(m[0]), "timestamp": m[1], "text": m[2].replace("\n", " ").strip()}
        for m in matches
    ]
    return subtitles

def predict_genre(text):
    """Predict the genre of a given text using the model."""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    predicted_class_index = outputs.logits.argmax().item()
    id2label = {
        0: "Action", 1: "Adventure", 2: "Comedy", 3: "Drama", 4: "Fantasy",
        5: "Horror", 6: "Romance", 7: "Crime", 8: "Historical", 9: "Mystery", 10: "Thriller"
    }
    return id2label[predicted_class_index]


def timestamp_to_seconds(timestamp):
    """Convert SRT timestamp (HH:MM:SS,ms) to seconds."""
    h, m, s = timestamp.split(":")
    s, ms = s.split(",")
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000

def group_subtitles_by_genre(subtitles):
    """Group subtitles by their predicted genre."""
    genre_dict = {}
    for subtitle in subtitles:
        genre = predict_genre(subtitle["text"])
        if genre not in genre_dict:
            genre_dict[genre] = []
        genre_dict[genre].append(subtitle)
    return genre_dict

def extract_and_save_clips(genre_dict, video_file, temp_dir):
    """Extract individual clips and save them as temporary files."""
    for genre, subtitles in genre_dict.items():
        temp_files = []
        for subtitle in subtitles:
            start, end = subtitle["timestamp"].split(" --> ")
            start_sec = timestamp_to_seconds(start)
            end_sec = timestamp_to_seconds(end)

            # Temporary filename for each clip
            temp_filename = f"{temp_dir}/{genre}_{subtitle['index']}.mp4"
            temp_files.append(temp_filename)

            # Use FFmpeg to extract the clip
            ffmpeg_command = [
                "ffmpeg", "-ss", str(start_sec), "-i", video_file, "-to", str(end_sec),
                "-c", "copy", temp_filename
            ]

            subprocess.run(ffmpeg_command, check=True)

        # Concatenate all clips for this genre
        concat_clips(temp_files, genre, temp_dir)

def concat_clips(temp_files, genre, output_dir):
    """Concatenate multiple clips into one using FFmpeg."""
    # Create a text file with the list of input files
    list_file = f"{output_dir}/{genre}_list.txt"
    with open(list_file, 'w') as f:
        for temp_file in temp_files:
            f.write(f"file '{temp_file}'\n")

    # Final output filename
    output_filename = f"{output_dir}/{genre}.mp4"

    # Use FFmpeg to concatenate clips
    ffmpeg_concat_command = [
        "ffmpeg", "-f", "concat", "-safe", "0", "-i", list_file, "-c", "copy", output_filename
    ]
    subprocess.run(ffmpeg_concat_command)

    print(f"Saved concatenated clip: {output_filename}")

def merge_overlapping_subtitles(subtitles):
    """Merge overlapping timestamps for subtitles of the same genre."""
    merged = []
    current = subtitles[0]

    for i in range(1, len(subtitles)):
        start_current, end_current = current["timestamp"].split(" --> ")
        start_next, end_next = subtitles[i]["timestamp"].split(" --> ")

        if timestamp_to_seconds(end_current) >= timestamp_to_seconds(start_next):
            # Merge overlapping timestamps
            current["timestamp"] = f"{start_current} --> {end_next}"
        else:
            merged.append(current)
            current = subtitles[i]

    merged.append(current)
    return merged


def main(input_srt, video_file, output_dir):
    """Main function to extract subtitles, predict genres, and save clips."""
    os.makedirs(output_dir, exist_ok=True)
    temp_dir = os.path.join(output_dir, "temp")
    os.makedirs(temp_dir, exist_ok=True)

    # Extract subtitles and group them by genre
    subtitles = extract_subtitles_from_srt(input_srt)
    genre_dict = group_subtitles_by_genre(subtitles)

    # Extract clips and save them as one file per genre
    extract_and_save_clips(genre_dict, video_file, temp_dir)

    # Clean up temporary files
    for root, _, files in os.walk(temp_dir):
        for file in files:
            os.remove(os.path.join(root, file))
    os.rmdir(temp_dir)

input_srt = '/home/rohanparab/Downloads/Inception.BluRay-English.srt'
video_file = '/home/rohanparab/Downloads/Inception (2010)/Inception.2010.720p.x264.mkv'
output_dir = '/home/rohanparab/Downloads/clips'

main(input_srt, video_file, output_dir)
