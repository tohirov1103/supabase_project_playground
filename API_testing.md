🔥 cURL Commands for API Testing

  🔐 Authentication Endpoints

  1. Sign Up

  curl -X POST "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/auth/signup" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycmNubXhjdXJibmlwbm5waWdjIiwicm9sZSI6ImFub24iLCJ
  pYXQiOjE3NTYxMTcyMjYsImV4cCI6MjA3MTY5MzIyNn0.Eo_zc8aM_tmuKaEW6Yark01b_c-njfDs__WBSgy2-Mw" \
    -d '{
      "email": "newuser@gmail.com",
      "password": "password123",
      "firstName": "John",
      "lastName": "Doe"
    }'

  2. Sign In

  curl -X POST "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/auth/signin" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycmNubXhjdXJibmlwbm5waWdjIiwicm9sZSI6ImFub24iLCJ
  pYXQiOjE3NTYxMTcyMjYsImV4cCI6MjA3MTY5MzIyNn0.Eo_zc8aM_tmuKaEW6Yark01b_c-njfDs__WBSgy2-Mw" \
    -d '{
      "email": "tokhirov2005@gmail.com",
      "password": "password123"
    }'

  ---
  👥 Users Endpoints

  3. Get All Users

  curl -X GET "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/users" \
    -H "Authorization: Bearer JWT_TOKEN_FROM_SIGNIN"

  4. Get User by ID

  curl -X GET "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/users/e5702ce1-98c1-454c-af98-0aaa0a405125" \
    -H "Authorization: Bearer JWT_TOKEN_FROM_SIGNIN"

  5. Update User

  curl -X PUT "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/users/e5702ce1-98c1-454c-af98-0aaa0a405125" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer JWT_TOKEN_FROM_SIGNIN" \
    -d '{
      "first_name": "Updated Name",
      "last_name": "Updated Last Name"
    }'

  ---
  ⚡ Working Examples (Copy & Paste Ready)

  Complete Test Flow:

  Step 1: Sign In (Copy JWT from response)
  curl -X POST "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/auth/signin" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycmNubXhjdXJibmlwbm5waWdjIiwicm9sZSI6ImFub24iLCJ
  pYXQiOjE3NTYxMTcyMjYsImV4cCI6MjA3MTY5MzIyNn0.Eo_zc8aM_tmuKaEW6Yark01b_c-njfDs__WBSgy2-Mw" \
    -d '{"email":"tokhirov2005@gmail.com","password":"password123"}'

  Step 2: Replace JWT_TOKEN_HERE with actual token and test:
  # Get All Users
  curl -X GET "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/users" \
    -H "Authorization: Bearer JWT_TOKEN_HERE"

  # Get Your User Profile
  curl -X GET "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/users/e5702ce1-98c1-454c-af98-0aaa0a405125" \
    -H "Authorization: Bearer JWT_TOKEN_HERE"

  # Update Your Profile
  curl -X PUT "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/users/e5702ce1-98c1-454c-af98-0aaa0a405125" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer JWT_TOKEN_HERE" \
    -d '{"first_name":"New Name","last_name":"Updated"}'

  ---
  🧪 Test with Different Data

  Sign Up New User:

  curl -X POST "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/auth/signup" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycmNubXhjdXJibmlwbm5waWdjIiwicm9sZSI6ImFub24iLCJ
  pYXQiOjE3NTYxMTcyMjYsImV4cCI6MjA3MTY5MzIyNn0.Eo_zc8aM_tmuKaEW6Yark01b_c-njfDs__WBSgy2-Mw" \
    -d '{"email":"testapi@gmail.com","password":"securepass123","firstName":"API","lastName":"Tester"}'

  Pretty JSON Output (add | jq):

  curl -X GET "https://vrrcnmxcurbnipnnpigc.supabase.co/functions/v1/users" \
    -H "Authorization: Bearer JWT_TOKEN_HERE" | jq

  Copy, paste, and test! 🚀