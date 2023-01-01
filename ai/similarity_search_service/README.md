### Removing elements from an index

https://github.com/facebookresearch/faiss/wiki/Special-operations-on-indexes#removing-elements-from-an-index

## Notes

word2vec
image vectorizer

metric learning

- parameterize a distance metric between vectors

- surogate model for mapping users to content

- time weighting of content interacted with by users
  - averaging embeddings is naive and sub-optimal

Loss Function:

- minimize distance between content and users that should be close
  - time of day, seasonality, etc

Next Step:
create user embeddings by averaging content that the user interacted with

youtube

- video 5's embedding
- average embedding of each vector

- can include content that the user is making as well
  - how different is content that user posts vs history

# To Do

- send Mike article on Siamese Network
- Read about metric learning
- surrogate modeling (student-teacher models?)
- doc2vec
- see if video to clip vector space exists
  - [short term: average frames from video ?]
