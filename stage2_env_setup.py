import os
import shutil

# Set the root directory (SLLOptimized)
ROOT_DIRECTORY = os.path.expanduser("~/Desktop/SLLOptimized")
ENV_FILE_SOURCE = "/Users/andrewweaver/Desktop/SLLWeb/social-launch-labs/.env.local"  # Your existing .env.local file
ENV_FILE_DEST = os.path.join(ROOT_DIRECTORY, ".env.local")

def copy_env_file():
    """Copies the old .env.local file to SLLOptimized."""
    if os.path.exists(ENV_FILE_SOURCE):
        shutil.copy(ENV_FILE_SOURCE, ENV_FILE_DEST)
        print(f"✅ Copied .env.local to {ENV_FILE_DEST}")
    else:
        print("⚠️ No existing .env.local file found at the specified path. Skipping copy.")

def update_env_variable(env_path, key, new_value):
    """Updates a specific key in .env.local."""
    if not os.path.exists(env_path):
        print("⚠️ .env.local not found! Skipping update.")
        return
    
    with open(env_path, "r") as file:
        lines = file.readlines()

    updated_lines = []
    found = False
    for line in lines:
        if line.startswith(f"{key}="):
            updated_lines.append(f"{key}={new_value}\n")
            found = True
        else:
            updated_lines.append(line)

    if not found:
        updated_lines.append(f"{key}={new_value}\n")  # Add key if missing

    with open(env_path, "w") as file:
        file.writelines(updated_lines)
    
    print(f"✅ Updated `{key}` in .env.local.")

def setup_env():
    """Handles the entire .env setup process."""
    copy_env_file()
    
    # Ask user if they want to use a new dataset
    change_dataset = input("\n🔄 Do you want to use a new Sanity dataset? (yes/no): ").strip().lower()
    if change_dataset == "yes":
        new_dataset = input("Enter new dataset name: ").strip()
        update_env_variable(ENV_FILE_DEST, "NEXT_PUBLIC_SANITY_DATASET", new_dataset)
        print("\n🚀 Run this command to create the new dataset in Sanity:")
        print(f"   sanity dataset create {new_dataset}\n")
    
    print("\n✅ Stage 2 Complete! .env.local is set up.\n")

if __name__ == "__main__":
    setup_env()
