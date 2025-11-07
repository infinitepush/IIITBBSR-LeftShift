import os
import subprocess
import time

def create_video(slide_images, audio_path, durations=None):
    """
    Create a video from slide images and audio using FFmpeg.
    """
    try:
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        existing_images = [img for img in slide_images if os.path.exists(img)]
        if not existing_images:
            raise FileNotFoundError("No valid slide images found")

        if durations is None:
            durations = [25] * len(existing_images)

        # Create a temporary file for ffmpeg concat demuxer
        with open("slides.txt", "w") as f:
            for img, dur in zip(existing_images, durations):
                f.write(f"file '{img}'\n")
                f.write(f"duration {dur}\n")

        path = "output/lecture.mp4"
        os.makedirs(os.path.dirname(path), exist_ok=True)

        # FFmpeg command to create video from images and add audio
        cmd = [
            "ffmpeg",
            "-f", "concat",
            "-safe", "0",
            "-i", "slides.txt",
            "-i", audio_path,
            "-c:v", "libx264",
            "-c:a", "aac",
            "-y",
            path
        ]

        subprocess.run(cmd, check=True)

        # Clean up the temporary file
        os.remove("slides.txt")

        try:
            from services.cloud_service import upload_file
            upload_result = upload_file(path, resource_type="video")
            if upload_result:
                return {"cloud_url": upload_result["secure_url"], "local_path": path}
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")

        return path
    except Exception as e:
        import traceback
        print(f"Error creating video: {e}")
        traceback.print_exc()
        return None

def create_video_without_audio(slide_images, output_path=None):
    """
    Create a video from slide images without audio using FFmpeg.
    """
    try:
        existing_images = [img for img in slide_images if os.path.exists(img)]
        if not existing_images:
            raise FileNotFoundError("No valid slide images found")

        if output_path is None:
            output_path = "output/lecture_no_audio.mp4"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Create a temporary file for ffmpeg concat demuxer
        with open("slides_no_audio.txt", "w") as f:
            for img in existing_images:
                f.write(f"file '{img}'\n")
                f.write("duration 5\n")

        # FFmpeg command to create video from images
        cmd = [
            "ffmpeg",
            "-f", "concat",
            "-safe", "0",
            "-i", "slides_no_audio.txt",
            "-c:v", "libx264",
            "-y",
            output_path
        ]

        subprocess.run(cmd, check=True)

        # Clean up the temporary file
        os.remove("slides_no_audio.txt")

        return output_path
    except Exception as e:
        import traceback
        print(f"Error creating video without audio: {e}")
        traceback.print_exc()
        return None

def get_media_duration(file_path):
    """
    Get the duration of a media file using FFmpeg.
    
    Args:
        file_path (str): Path to the media file
        
    Returns:
        float: Duration in seconds, or None if there's an error
    """
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return None
            
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            file_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            duration = result.stdout.strip()
            if duration:
                return float(duration)
        else:
            print(f"FFprobe error: {result.stderr}")
            # Try alternative method with ffmpeg
            return get_duration_with_ffmpeg_fallback(file_path)
    except subprocess.TimeoutExpired:
        print("FFprobe timeout")
        return None
    except FileNotFoundError:
        print("FFprobe not found in system PATH, trying alternative method")
        # Try alternative method
        return get_duration_with_ffmpeg_fallback(file_path)
    except Exception as e:
        print(f"Error getting media duration: {e}")
        return None

def get_duration_with_ffmpeg_fallback(file_path):
    """
    Fallback method to get duration using ffmpeg command.
    
    Args:
        file_path (str): Path to the media file
        
    Returns:
        float: Duration in seconds, or None if there's an error
    """
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            return None
            
        cmd = [
            "ffmpeg",
            "-i", file_path,
            "-f", "null",
            "-"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        # Parse duration from ffmpeg output
        import re
        duration_match = re.search(r"Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})", result.stderr)
        if duration_match:
            hours, minutes, seconds = duration_match.groups()
            total_seconds = int(hours) * 3600 + int(minutes) * 60 + float(seconds)
            return total_seconds
        else:
            print("Could not parse duration from ffmpeg output")
            return None
    except Exception as e:
        print(f"Fallback duration detection failed: {e}")
        return None