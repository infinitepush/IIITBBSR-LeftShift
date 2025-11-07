import openai
from config.config import OPENAI_API_KEY

# Initialize the OpenAI client
try:
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    openai_available = True
except Exception as e:
    print(f"OpenAI not configured: {e}")
    openai_available = False

def generate_lecture(prompt):
    """Generates structured lecture JSON from prompt."""
    if not openai_available:
        # Return properly formatted mock data for testing
        return '''{
    "slides": [
        {
            "title": "Introduction to Photosynthesis",
            "content": ["Photosynthesis converts light energy to chemical energy", "It occurs in chloroplasts of plant cells", "It produces glucose and oxygen"],
            "script": "Photosynthesis is the process by which plants convert light energy into chemical energy. This process occurs in the chloroplasts of plant cells and produces glucose and oxygen."
        }
    ],
    "quiz": [
        {
            "question": "Where does photosynthesis occur?",
            "options": ["Mitochondria", "Chloroplasts", "Nucleus", "Cell membrane"],
            "answer": "Chloroplasts"
        }
    ]
}'''
    
    try:
        system_prompt = """
You are an educational content generator. 
Given a topic, target audience, and duration, produce:
1. A structured slide outline with detailed content (title, comprehensive bullet points with explanations, detailed narration script). The narration script for each slide should be long enough to be read in approximately 25 seconds at a normal speaking pace.
2. 3 multiple-choice quiz questions with explanations.
Format output in valid JSON with detailed content.
{
    "slides": [
        {
            "title": "Slide Title",
            "content": ["bullet point 1", "bullet point 2", "bullet point 3"],
            "script": "Narration script for this slide"
        }
    ],
    "quiz": [
        {
            "question": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "answer": "Correct option"
        }
    ]
}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating lecture: {e}")
        # Return mock data as fallback
        return '''{
    "slides": [
        {
            "title": "Introduction to Photosynthesis",
            "content": ["Photosynthesis converts light energy to chemical energy", "It occurs in chloroplasts of plant cells", "It produces glucose and oxygen"],
            "script": "Photosynthesis is the process by which plants convert light energy into chemical energy. This process occurs in the chloroplasts of plant cells and produces glucose and oxygen."
        }
    ],
    "quiz": [
        {
            "question": "Where does photosynthesis occur?",
            "options": ["Mitochondria", "Chloroplasts", "Nucleus", "Cell membrane"],
            "answer": "Chloroplasts"
        }
    ]
}'''