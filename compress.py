import os
import subprocess


def compress_videos(root_dir):
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".mp4") and not filename.endswith("_compressed.mp4"):
                input_path = os.path.join(dirpath, filename)
                output_path = os.path.join(dirpath, filename[:-4] + "_compressed.mp4")

                print(f"Compressing: {input_path}")
                try:
                    # Run ffmpeg to compress the video
                    subprocess.run(
                        [
                            "ffmpeg",
                            "-i",
                            input_path,
                            "-vcodec",
                            "libx264",
                            "-crf",
                            "28",  # adjust for quality/size tradeoff (lower = better quality, bigger file)
                            "-preset",
                            "fast",
                            output_path,
                        ],
                        check=True,
                    )
                    print(f"Saved compressed video to: {output_path}")
                except subprocess.CalledProcessError as e:
                    print(f"Error compressing {input_path}: {e}")


if __name__ == "__main__":
    target_directory = (
        "/Users/omarrayyann/Documents/mv-umi.github.io/data_collection_videos"
    )
    compress_videos(target_directory)
