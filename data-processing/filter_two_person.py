import csv
import glob
import os
import sys
import re
from concurrent.futures import ProcessPoolExecutor, as_completed
from collections import defaultdict

def process_csv_file(file_path):
    conversations = defaultdict(list)
    with open(file_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            conv_key = (row["folder"], row["dialogueID"])
            turn = {
                "date": row["date"],
                "from": row["from"],
                "to": row["to"],
                "text": row["text"]
            }
            conversations[conv_key].append(turn)
    return dict(conversations)


def build_conversation_list(conversations):    
    conv_list = []
    for (folder, dialogueID), turns in conversations.items():
        turn_count = len(turns)
        conversation_text = " || ".join(
            f"[{turn['date']}] {turn['from']} -> {turn['to'].strip() if turn['to'].strip() else 'N/A'}: {turn['text']}"
            for turn in turns
        )
        from_users = sorted({turn["from"] for turn in turns})
        to_users = sorted({turn["to"] for turn in turns if turn["to"].strip()})
        
        conv_list.append({
            "folder": folder,
            "dialogueID": dialogueID,
            "turn_count": turn_count,
            "conversation_text": conversation_text,
            "from_users": ", ".join(from_users),
            "to_users": ", ".join(to_users)
        })
    return conv_list

def write_single_conversation(conversation_turns, dialogueID, turn_count):
    filename = f"{dialogueID}-{turn_count}.csv"
    fieldnames = ["date", "from", "to", "text"]
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for turn in conversation_turns:
            writer.writerow(turn)
    print(f"Conversation for dialogueID {dialogueID} (turns: {turn_count}) written to {filename}")

def main():
    input_path = sys.argv[1]
    # output_file = "conversations_sorted.csv"

    # expects file, directory or regex
    if os.path.isfile(input_path):
        csv_files = [input_path]
    elif os.path.isdir(input_path):
        csv_files = glob.glob(os.path.join(input_path, "*.csv"))
    else:
        csv_files = glob.glob(input_path)
    print(f"Found {len(csv_files)} CSV file(s) to process.")

    processed_results = []
    with ProcessPoolExecutor() as executor:
        future_to_file = {executor.submit(process_csv_file, file_path): file_path for file_path in csv_files}
        for future in as_completed(future_to_file):
            file_path = future_to_file[future]
            try:
                result = future.result()
                processed_results.append(result)
                print(f"Processed file: {file_path}")
            except Exception as exc:
                print(f"File {file_path} generated an exception: {exc}")

    # merge messages for same convo
    merged_conversations = {}
    for conv_dict in processed_results:
        for key, turns in conv_dict.items():
            if key in merged_conversations:
                merged_conversations[key].extend(turns)
            else:
                merged_conversations[key] = turns    
    
    conversation_list = build_conversation_list(merged_conversations)
    conversation_list.sort(key=lambda x: x["turn_count"], reverse=True)

    print("\nTop conversations by number of turns:")
    top10 = conversation_list[:50]
    for conv in top10:
        print(f"Folder: {conv['folder']}, DialogueID: {conv['dialogueID']}, Turns: {conv['turn_count']}")
        print(f"From Users: {conv['from_users']}")
        print(f"To Users: {conv['to_users']}")
        
        conv_key = (conv["folder"], conv["dialogueID"])
        convos = merged_conversations.get(conv_key, [])

        filename = re.sub(r'[\s\/*?:"<>|]+', '', conv['from_users'])    
        filename = f"{filename}-{conv["turn_count"]}.csv"
        fieldnames = ["date", "from", "to", "text"]
        with open(filename, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            for turn in convos:
                writer.writerow(turn)
        print(f"Conversation for users: {conv['from_users']} (turns: {conv["turn_count"]}) written to {filename}")    

if __name__ == "__main__":
    main()
