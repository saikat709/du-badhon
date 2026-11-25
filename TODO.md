1. Pending donation page with sidebar entry, where we see blood requests that have been assigned with donor and been send to donate. From here members can easily mark complete or cancelled. (dont remove those from blood requests page thats current beahviour)
2. "Live Calling in Progress:🔒 Tanvir Hasan calling Kazi Farhan (B+)" is fake, and leads to homepage, fix it. make it real.
3. the call locking works, but it isnt realtime. WHne i login from somehwre elsem and click resume, it started from countdowqn 0 and also it did not close the first opened call. It should be realtime communication. For same person as well as for different persons.
4. We need a my club side bar entry, with our unit members listed. Where all other roles rather than members can add or remove or change role of others. Keep some predefined roles needed for a club, we will just select. 
5. the /dashboard hero card takes much height. Redesign it.
6. Make the blood request creation two step, first it selects target with checkbox dont ask today. Second step is informations.
7. Remove technical wordings and sentences from the whole system e.g PWA. Normal users dont underatand them. E.g this sentence you wrote "DU Badhon v1.2.0 • PWA & APK"
8. The blood group pill/icon with circular rectangle bg in cards are not fixed sized, so A- and AB- showing different size.
9. In http://localhost:3000/hall-units, when we select all units, we should not seperate them by unit wise cards. rather we should show a single card with grids of people with the info of unit in the information part of the elements body for each.
10. Add developer recorgination in somewhere footer or somewhere as well as a designated page for that. (I am the developer, You know me! Saikat Islam.)
11. Since multiple member can search for one blood request (but cant call same doner at the same time). We should show info saying being searched by chips with the names of the member.
12. Add actual authentication and user specific profile (currently can see other members profile by just selecting name, we should be able to select name in profile). Profile edit option (update contact, bio, department, and change password; persistent session via secure cookies).
13. Update current member and others seed data with simple member1 name and pass member1, this type easy pattern, so it becomes easy to remember and login for me. (e.g. member1/member1, member2/member2, president1/president1, admin/admin).
14. Since we have mobile PWA & Android app, setup connection error/offline notifications when no internet connection, along with friendly retry state.
15. Use actual database now: Turso (libSQL / serverless SQLite) for Vercel persistence and local dev with zero data wipeouts, supporting seamless migration to PostgreSQL if needed later.
16. Add bottom navigation bar for mobile app and mobile website view (Dashboard, Blood Requests, Search Donors, Pending Donations, My Profile) for quick thumb-reach access.

