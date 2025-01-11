from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI

client = OpenAI(
  api_key="sk-svcacct-21wZQaBc8_ukUENTNQ9msw1gPIrQujyDXVK1bWIOKEaoA-D_AWCvZespSTceKp9T3BlbkFJh0iMq6w89rIzG6Ebw03ccdWlmZS8t5SE1wSULmDa_WXLtcJQmiVTwLKIV4nrEAA"
)
class ChatbotAPIView(APIView):
    def post(self, request):
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call OpenAI API to generate a response
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": ""},
                    {"role": "user", "content": user_message},
                ],
            )
            reply = response.choices[0].message
            print(reply)
            return Response({"response": reply}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

