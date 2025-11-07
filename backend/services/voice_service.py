from gtts import gTTS
import subprocess

def generate_voiceover(script_text, path):
    tts = gTTS(text=script_text, lang='en', slow=False)
    tts.save(path)
    return path

def combine_audio(audio_paths, output_path):
    with open("concat_list.txt", "w") as f:
        for path in audio_paths:
            f.write(f"file '{path}'\n")

    command = [
        "ffmpeg",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "concat_list.txt",
        "-c",
        "copy",
        output_path,
        "-y"
    ]
    subprocess.run(command, check=True)
    return output_path