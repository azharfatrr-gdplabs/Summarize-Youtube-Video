# app/utils/prompt_engineering.py


def generate_summary_prompt(transcript, summary_length="concise"):
    """
    Generates a summary prompt with specified summary length.

    Parameters:
        transcript (str): The transcript text to summarize.
        summary_length (str): Desired summary length ('concise', 'detailed', 'bullet').

    Returns:
        str: The engineered prompt.
    """
    # Define instructions based on desired summary length
    instructions = {
        "concise": (
            "Please provide a concise summary of the following YouTube video transcript. "
            "Ensure that the summary captures the key points and main ideas without omitting essential information."
        ),
        "detailed": (
            "Please provide a detailed summary of the following YouTube video transcript. "
            "Include all significant points and elaborate on key ideas presented in the content."
        ),
        "bullet": (
            "Please provide a bullet-point summary of the following YouTube video transcript. "
            "Highlight the main ideas and key points in a clear and organized list."
        ),
        "complete": (
            """
            Summarize the following YouTube video transcript:
            Please ensure the summary is structured using Markdown (MD). Your response should include the following sections:
                0. Title (H2)
                1. (H3) Overview: Provide a brief overview of the video's main topic or theme.
                2. (H3) Speakers: Identify the speakers by name or role (if possible).
                3. (H3) Key Insights: List the top (5 or more) most important points or insights from the video, each accompanied by a short explanation. Use bullet points or subpoint for clarity.
                4. (H3) Notable Quotes: Include any notable quotes or standout statements made by the speaker(s).
                5. (H3) Key Takeaways: Summarize the main conclusions or actionable insights that viewers should retain after watching the video.
            Your response should be well-structured and easy to read.
            """
        ),
    }

    instruction = instructions.get(summary_length, instructions["concise"])

    prompt = f"{instruction}\n\n" "Transcript:\n" f"{transcript}\n\n" "Summary:"

    return prompt
