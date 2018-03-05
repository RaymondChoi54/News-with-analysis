# news IT

**Main Features:**
1. Search and Filter Options
2. Main Dashboard
3. Side Navigation
4. Saved Topics
5. Login/Sign Up Forms

**Feature Breakdown and Usability:**
The main page of the website displays the top 20 headlines today in the U.S. The user can search for a specific topic on the top right hand corner by clicking the search button. They can filter their search options by clicking advanced search (Drop down menu) and sort the list based on date, popularity, relevance and/or language. Since the search option is the key feature it is easily accessible on every page of the site. When scrolling, articles are automatically loaded as the user scrolls down further. 

The side menu bar has options for Search, Saved Topics, Sign Up, Login and Logout. When the user signs in, they are redirected to their personalized dashboard. Creating an account allows the user to save their desired topics and keep a record of the sentiment of the topic in the Saved Topics tab. 

When the user searches, they will see an add topic button that will allow them to save the topic. Currently, anyone can save topics however once the backend is implemented and users’ accounts are stored, users can only save topics once they have logged in. The user can click on a saved topic to automatically view that search. There will be graphs and other visuals that will show the sentiment history of the topic so the user can see the changes in the sentiment (not yet implemented because backend is required). 

Once the user logs out, they will be redirected to the public page. 

**Implementations and problems**
We were planning on using the Watson API to use for sentiment analysis, but unfortunately we realized it does not support CORS at the moment. Thus, we switched over to use the Google Cloud API for sentiment analysis since it did support CORS. For the login page, we have the front end, but we will implement the backend in A3. Similarly, for the sentiment analysis graph of topics that the user has saved, that will also be implemented in the backend in A3, since we will need to store the data of the sentiment.
