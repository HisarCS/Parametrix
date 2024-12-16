import os
import json
from datetime import datetime
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    DataCollatorForSeq2Seq,
    pipeline
)


os.environ["WANDB_DISABLED"] = "true" #for colab


token = "{Acsess Token}


print("Loading dataset...")
dataset = load_dataset("json", data_files="prompts.jsonl")
dataset = dataset["train"].train_test_split(test_size=0.2, seed=42)
print("Dataset loaded and split successfully.")


def preprocess_function(example):
    return tokenizer(
        example["input"],
        text_target=example["output"],
        truncation=True,
        padding="max_length",
        max_length=128
    )


print("Loading tokenizer and model...")
model_name = "google/flan-t5-base"  
tokenizer = AutoTokenizer.from_pretrained(model_name, token=token)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, token=token)
print("Tokenizer and model loaded successfully.")


print("Tokenizing dataset...")
tokenized_dataset = dataset.map(preprocess_function, batched=True)
print("Dataset tokenized successfully.")


training_args = Seq2SeqTrainingArguments(
    output_dir="./fine_tuned_model",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=40,
    save_steps=500,
    save_total_limit=2,
    predict_with_generate=True,
    logging_dir="./logs",
    logging_steps=10,
    report_to="none", 
    fp16=False
)


data_collator = DataCollatorForSeq2Seq(tokenizer, model=model)
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["test"],
    tokenizer=tokenizer,
    data_collator=data_collator
)


print("Starting training...")
trainer.train()
print("Training completed.")


print("Saving fine-tuned model...")
model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")
print("Model saved successfully.")
