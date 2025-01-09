from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import openai

openai.api_key = "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"

class ChatbotAPIView(APIView):
    def post(self, request):
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call OpenAI API to generate a response
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are Dhrumil, a software engineer. Answer questions about your resume, projects, and interests."},
                    {"role": "user", "content": user_message},
                ],
            )
            reply = response['choices'][0]['message']['content']
            return Response({"response": reply}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

