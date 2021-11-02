To Do

- confirm that Postgres types are deleted


- Edit Posts controller to accept ordered list of Media (https://softwareengineering.stackexchange.com/questions/304593/how-to-store-ordered-information-in-a-relational-database)


- add image validation



- add user to followed posts list



- handle post schedules

- endpoint for accessing post scheduled
    - Request:
        - month [0 based value]
        - year
        - user time zone
    - Resonse:
        - list of posts
            - with is going live / has expired attributes


- add expiration to create post









- add post hashtags to handleGetPageOfPostsPagination

- implement create shop item
- implement update shop item
- implement handleUpdatePost
- implement handleDeleteShopItem


- Determine response fields for handleSearchUserProfilesByUsername
- implement handleSearchUserProfilesByUsername
- implement handleGetPostsScheduledByUser



### COMPLETED October 26, 2021
- added shop item C,U,D