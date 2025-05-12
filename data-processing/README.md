# chat-vibe-check

## Data Source
Dataset from Kaggle of over one million two-person chat logs related to Ubuntu technical support: https://www.kaggle.com/datasets/rtatman/ubuntu-dialogue-corpus/data

## Data Processing
We decided to limit the scope of our data to the 50 longest conversations within the dataset. This was done using chat-vibe-check/data-processing/filter_two_person.py . It expects a file, directory or regex pattern as the first argument and writes the messages of the 50 longest conversations to their own CSV file. Example usage:
```
# Processes all CSVs under Ubuntu-dialogue-corpus/
python3 data-processing/filter_two_person.py Ubuntu-dialogue-corpus/

# Process a single file only
python3 data-processing/filter_two_person.py Data/small-sample.csv
```