export const roadmapData = {
  "title": "Sama DevOps Mastery: Zero to Cloud Hero",
  "subtitle": "A 30-Day step-by-step interactive roadmap from Linux basics to production deployments.",
  "totalDays": 30,
  "modules": [
    {
      "id": "module-1",
      "number": 1,
      "title": "Linux Server Foundations & Command Mastery",
      "days": "Days 1 - 3",
      "level": "Beginner",
      "icon": "Terminal",
      "description": "Learn how Linux servers think, navigate directories without a desktop GUI, manage file ownership, memory, and diagnose system resources like a pro.",
      "lessons": [
        {
          "id": "m1-l1",
          "title": "Linux Filesystem & Server Navigation",
          "timeEstimate": "40 mins",
          "deployRef": "deploy.md Section 5 (Line 107: sudo mkdir -p /opt/sama)",
          "analogy": "Think of a Linux server like a large corporate headquarters. Windows gives each department a separate building (C: drive, D: drive). Linux has ONE single master entrance '/' (Root). Every folder inside is a specialized office with strict rules.",
          "whyItMatters": "On a production cloud server, there is no mouse or desktop. If you don't know where configuration files, applications, and logs live, you cannot troubleshoot or deploy anything.",
          "keyConcept": "Standard Linux folders you must memorize:\n- / (Root): The top of the entire world.\n- /opt (Optional software): The standard place for custom application code (this is why deploy.md uses /opt/sama!).\n- /etc (Editable Text Configs): Where system configurations live (like /etc/ssh, /etc/nginx, /etc/fstab).\n- /var (Variable data): Files that grow constantly, like logs (/var/log) and databases (/var/lib/postgresql).\n- /home: Personal user directories (~ or /home/ubuntu).",
          "commands": [
            {
              "cmd": "pwd",
              "explain": "Print Working Directory: Tells you exactly which folder you are currently standing in."
            },
            {
              "cmd": "ls -la",
              "explain": "List All: Shows all files including hidden ones (starting with a dot like .env) with sizes, owners, and permissions."
            },
            {
              "cmd": "cd /opt",
              "explain": "Change Directory: Moves into the /opt directory."
            },
            {
              "cmd": "sudo mkdir -p /opt/sama",
              "explain": "Make Directory: Creates /opt/sama. The -p flag creates parent folders automatically if needed."
            }
          ],
          "exercise": {
            "title": "Navigate and Create Application Folders",
            "objective": "Practice moving around the system, checking hidden files, and creating standard deployment folders.",
            "steps": [
              "1. Run `pwd` to check your current folder.",
              "2. Run `ls -la` to list all files including dotfiles.",
              "3. Navigate to `/var/log` with `cd /var/log` and view the logs.",
              "4. Create a test directory `/tmp/devops-test/app` using `mkdir -p`.",
              "5. Verify with `ls -ld /tmp/devops-test/app`."
            ],
            "testCommand": "ls -ld /tmp/devops-test/app",
            "solution": "pwd\nls -la\ncd /var/log && ls -la\nmkdir -p /tmp/devops-test/app\nls -ld /tmp/devops-test/app",
            "solutionExplanation": "The -p flag guarantees that mkdir will not fail if intermediate directories are missing; it creates the full path safely."
          }
        },
        {
          "id": "m1-l2",
          "title": "File Permissions & Security (chmod 600)",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 6 (Line 124: chmod 600 .env) & Section 5 (Line 107: sudo chown ubuntu: /opt/sama)",
          "analogy": "Think of file permissions like locks on hotel rooms. Some rooms are open to everyone (Public lobby). Some are private suites where only the guest with the room key (Owner) can enter. Your .env file contains database passwords, so it must be locked so ONLY the owner can read it.",
          "whyItMatters": "If your `.env` has 777 permissions (world readable/writable), any compromised process, web user (www-data), or attacker on the server can read your database passwords and API keys.",
          "keyConcept": "Understanding Linux permissions:\nEvery file has 3 groups of people:\n1. User (Owner) - The person who created the file.\n2. Group - A collection of users.\n3. Others - Everyone else in the world.\n\nNumbers represent permission values:\n- Read (r) = 4\n- Write (w) = 2\n- Execute (x) = 1\n\nAdd them together:\n- 7 = 4+2+1 (Read, Write, Execute)\n- 6 = 4+2 (Read and Write)\n- 4 = 4 (Read only)\n- 0 = No permission at all!\n\nSo `chmod 600 .env` means:\n- User (Owner) = 6 (Read + Write)\n- Group = 0 (Nothing)\n- Others = 0 (Nothing)\nResult: ONLY YOU can see and edit the secrets!",
          "commands": [
            {
              "cmd": "sudo chown ubuntu: /opt/sama",
              "explain": "Change Owner: Gives ownership of /opt/sama to the user 'ubuntu' so you do not have to type sudo for every file edit."
            },
            {
              "cmd": "chmod 600 .env",
              "explain": "Sets read/write permissions for the owner only. Blocks everyone else on the server."
            },
            {
              "cmd": "ls -l .env",
              "explain": "Verifies permissions. It should print: -rw------- (Owner has read/write, everyone else has nothing)."
            }
          ],
          "exercise": {
            "title": "Lock Down a Secret Environment File",
            "objective": "Create a sensitive configuration file and secure it using chmod 600.",
            "steps": [
              "1. Create a dummy file named `test.env` with secret text: `echo 'SECRET_KEY=12345' > test.env`.",
              "2. Check current permissions with `ls -l test.env` (notice others can read it!).",
              "3. Lock it down using `chmod 600 test.env`.",
              "4. Run `ls -l test.env` again to verify it displays `-rw-------`."
            ],
            "testCommand": "ls -l test.env | awk '{print $1}'",
            "solution": "echo 'SECRET_KEY=12345' > test.env\nls -l test.env\nchmod 600 test.env\nls -l test.env",
            "solutionExplanation": "The output -rw------- confirms that the owner has Read (r) and Write (w) permissions, and group/others have 0 permissions (indicated by dashes -)."
          }
        },
        {
          "id": "m1-l3",
          "title": "RAM, Swap Space & Preventing OOM Crashes",
          "timeEstimate": "55 mins",
          "deployRef": "deploy.md Section 1.5 (Lines 57-61: fallocate -l 4G /swapfile ...)",
          "analogy": "Imagine your computer desk is your physical RAM. When you work on a huge project (like building Next.js and NestJS), your desk gets full of papers. Swap space is like a drawer next to your desk on the hard drive. When your desk is full, your computer moves less-used papers to the drawer so your computer does not freeze or crash!",
          "whyItMatters": "Building Docker images with TypeScript, Next.js, and Prisma takes a lot of memory. If your server runs out of RAM, Linux uses a brutal killer called the OOM (Out Of Memory) Killer, which immediately terminates the build process with 'Killed 137'. A 4GB swap file prevents this!",
          "keyConcept": "Step-by-step Swap setup:\n1. `fallocate -l 4G /swapfile`: Reserves a 4-Gigabyte empty file on the SSD.\n2. `chmod 600 /swapfile`: Locks the swapfile so other users cannot read memory contents.\n3. `mkswap /swapfile`: Formats the file into Linux swap storage format.\n4. `swapon /swapfile`: Turns it on in the Linux kernel.\n5. `/etc/fstab`: If you restart the server, swap turns off. Adding it to `/etc/fstab` makes it turn back on automatically on every server boot!",
          "commands": [
            {
              "cmd": "free -m",
              "explain": "Shows total, used, and free RAM and Swap in Megabytes."
            },
            {
              "cmd": "sudo fallocate -l 4G /swapfile",
              "explain": "Quickly creates a 4GB file called /swapfile."
            },
            {
              "cmd": "sudo chmod 600 /swapfile",
              "explain": "Protects memory dump contents from being read by unauthorized users."
            },
            {
              "cmd": "sudo mkswap /swapfile && sudo swapon /swapfile",
              "explain": "Formats the file as swap space and activates it immediately."
            },
            {
              "cmd": "echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab",
              "explain": "Adds a line to the filesystem table so swap survives server reboots."
            }
          ],
          "exercise": {
            "title": "Check System Memory and Understand Swappiness",
            "objective": "Inspect your active RAM and swap, and understand how to read system memory stats.",
            "steps": [
              "1. Run `free -h` to see your system memory in human-readable gigabytes/megabytes.",
              "2. Run `swapon --show` to see what swap devices are currently active.",
              "3. Explain what 'OOM Killer' does when RAM reaches 100% and there is no swap."
            ],
            "testCommand": "free -h",
            "solution": "free -h\nswapon --show",
            "solutionExplanation": "If free shows Swap: 0B, your server is vulnerable to OOM kills during heavy Docker builds. Once swapon is active, Swap will show 4.0G available."
          }
        },
        {
          "id": "m1-l4",
          "title": "Safe Package Management & System Maintenance",
          "timeEstimate": "35 mins",
          "deployRef": "deploy.md Section 1.5 (Line 57: sudo apt update && sudo apt -y upgrade)",
          "analogy": "Think of `apt update` like refreshing the menu at a restaurant to see what new dishes exist. Think of `apt upgrade` like actually ordering the new food to your table.",
          "whyItMatters": "Linux security patches come out weekly. Unpatched servers get hacked by automated bots scanning the internet. You must know how to update the system cleanly without breaking your software.",
          "keyConcept": "The apt workflow in Ubuntu:\n- `apt update`: Downloads the latest package list from Ubuntu servers. It does NOT upgrade any software yet!\n- `apt -y upgrade`: Actually downloads and installs the newer versions of installed packages. The `-y` flag answers 'Yes' automatically so the terminal does not pause waiting for you.\n- `apt autoremove`: Cleans up old packages and old Linux kernels that are no longer needed, freeing up SSD disk space.",
          "commands": [
            {
              "cmd": "sudo apt update",
              "explain": "Refreshes the package index from Ubuntu repositories."
            },
            {
              "cmd": "sudo apt -y upgrade",
              "explain": "Upgrades all installed packages to their latest secure versions without prompting."
            },
            {
              "cmd": "sudo apt autoremove -y",
              "explain": "Removes orphaned packages and frees disk space."
            }
          ],
          "exercise": {
            "title": "Simulate Package Management and Cleanups",
            "objective": "Learn the distinction between updating metadata and upgrading packages.",
            "steps": [
              "1. Explain why `apt update` alone does NOT fix security vulnerabilities.",
              "2. What happens if you omit the `-y` flag in automated scripts?",
              "3. Write the single line command to update package lists and upgrade packages together."
            ],
            "testCommand": "echo 'sudo apt update && sudo apt -y upgrade'",
            "solution": "sudo apt update && sudo apt -y upgrade",
            "solutionExplanation": "Using && ensures that apt upgrade only runs if apt update finishes successfully with an exit code of 0."
          }
        },
        {
          "id": "m1-l5",
          "title": "Process Diagnostics & Signals (SIGTERM vs SIGKILL)",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 11 (Line 253: docker compose ps & logs)",
          "analogy": "Think of process monitoring like the medical monitor in a hospital room showing a patient's heart rate and oxygen. If a process goes crazy and uses 100% CPU, your server slows to a crawl.",
          "whyItMatters": "When your site gives a 502 Bad Gateway or runs slowly, you must quickly check which process is eating CPU or RAM, and terminate hung processes safely.",
          "keyConcept": "Essential diagnostic tools:\n- `htop`: Interactive visual task manager in the terminal.\n- `ps aux`: Lists every process running on the system with its Process ID (PID), CPU%, and Memory%.\n- `df -h`: Shows disk space usage (Disk Free) in human-readable format (G for Gigabytes). Always make sure your disk is not 100% full!\n- `kill -15 <PID>`: SIGTERM (graceful shutdown, allows the app to finish requests and close database connections).\n- `kill -9 <PID>`: SIGKILL (immediate force kill, used only if the app is frozen and will not respond to SIGTERM).",
          "commands": [
            {
              "cmd": "df -h",
              "explain": "Shows disk space usage for all mounted drives. Check that / is not 100% full."
            },
            {
              "cmd": "ps aux | grep node",
              "explain": "Finds all running Node.js processes and displays their PIDs."
            },
            {
              "cmd": "kill -15 <PID>",
              "explain": "Sends SIGTERM to stop a process cleanly."
            }
          ],
          "exercise": {
            "title": "Inspect Disk Usage and Find Active Processes",
            "objective": "Practice running system health checks.",
            "steps": [
              "1. Run `df -h` to see how much free disk space your machine has.",
              "2. Run `ps aux | head -n 10` to view the top 10 running system processes.",
              "3. Explain the difference between `kill -15` (SIGTERM) and `kill -9` (SIGKILL)."
            ],
            "testCommand": "df -h /",
            "solution": "df -h /\nps aux | head -n 10",
            "solutionExplanation": "SIGTERM (15) gives the application a chance to save state and clean up sockets. SIGKILL (9) abruptly halts the process at the kernel level."
          }
        }
      ]
    },
    {
      "id": "module-2",
      "number": 2,
      "title": "Linux Background Services, Systemd & Daemons",
      "days": "Days 4 - 6",
      "level": "Beginner to Intermediate",
      "icon": "Server",
      "description": "Understand how background services run 24/7 on Linux, master systemctl, write your own auto-restarting systemd service, and inspect journal logs.",
      "lessons": [
        {
          "id": "m2-l1",
          "title": "Understanding Systemd & PID 1",
          "timeEstimate": "45 mins",
          "deployRef": "Linux Server Administration core pattern (How Docker and Nginx start)",
          "analogy": "Think of Systemd like the CEO of a company. When the company opens (Linux boots), the CEO arrives first (PID 1). The CEO hires the security guard (SSH), the receptionist (Nginx), and the factory workers (Docker), and makes sure they work all day.",
          "whyItMatters": "If a server reboots or crashes, you cannot manually log in at 3 AM to type `npm start`. Systemd guarantees that Docker, Nginx, and your databases turn on automatically whenever the server turns on.",
          "keyConcept": "Key Systemd concepts:\n- **PID 1**: The first process started by the Linux kernel. It is the parent of every other process on the machine.\n- **Daemons**: Programs that run quietly in the background without needing a user logged in.\n- **Unit Files**: Plain text files ending in `.service` that define how a program starts, stops, and restarts.",
          "commands": [
            {
              "cmd": "ps -p 1 -o comm=",
              "explain": "Prints the name of PID 1 (usually 'systemd')."
            },
            {
              "cmd": "systemctl is-system-running",
              "explain": "Checks overall health of all systemd services ('running' or 'degraded')."
            }
          ],
          "exercise": {
            "title": "Check Systemd Status",
            "objective": "Verify that Systemd is running as PID 1 on your Linux system.",
            "steps": [
              "1. Run `ps -p 1 -o comm=` to verify systemd is process #1.",
              "2. Run `systemctl is-system-running` to check overall system health."
            ],
            "testCommand": "ps -p 1 -o comm=",
            "solution": "ps -p 1 -o comm=\nsystemctl is-system-running",
            "solutionExplanation": "Systemd manages system initialization and keeps critical background daemons alive."
          }
        },
        {
          "id": "m2-l2",
          "title": "Managing Services with Systemctl",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 1.4 & Section 2 (systemctl restart ssh, docker service)",
          "analogy": "Think of `systemctl` like the remote control for your television. You can turn a channel on (`start`), turn it off (`stop`), refresh it (`restart`), or set an alarm so it turns on every morning (`enable`).",
          "whyItMatters": "Every DevOps engineer uses `systemctl` daily to manage Nginx, Docker, SSH, and firewalls. Knowing the difference between `start` and `enable` is critical!",
          "keyConcept": "The 6 Essential Systemctl Commands:\n- `systemctl status <service>`: Check if service is active (running) or failed.\n- `systemctl start <service>`: Start it right now.\n- `systemctl stop <service>`: Stop it right now.\n- `systemctl restart <service>`: Stop and immediately restart.\n- `systemctl enable <service>`: Configure it to start AUTOMATICALLY on server reboot!\n- `systemctl disable <service>`: Stop it from starting on boot.\n\nPRO TIP: `systemctl enable --now <service>` starts it now AND enables it for reboot in one step!",
          "commands": [
            {
              "cmd": "sudo systemctl status docker",
              "explain": "Checks if the Docker daemon is currently running and healthy."
            },
            {
              "cmd": "sudo systemctl restart nginx",
              "explain": "Restarts the Nginx web server."
            },
            {
              "cmd": "sudo systemctl enable --now docker",
              "explain": "Enables Docker on boot and starts it immediately."
            }
          ],
          "exercise": {
            "title": "Inspect and Control System Services",
            "objective": "Practice checking status and controlling background services.",
            "steps": [
              "1. Run `systemctl status ssh` to see SSH status.",
              "2. Explain what `enable` does versus `start`.",
              "3. Write the command to check if docker is enabled on boot."
            ],
            "testCommand": "systemctl is-enabled ssh 2>/dev/null || echo 'enabled'",
            "solution": "systemctl status ssh\nsystemctl is-enabled ssh\n# 'start' runs the process now. 'enable' creates a symlink so it boots automatically after restart.",
            "solutionExplanation": "Services that are started but not enabled will not return after a server reboot."
          }
        },
        {
          "id": "m2-l3",
          "title": "Writing a Custom Systemd Service File",
          "timeEstimate": "60 mins",
          "deployRef": "Core DevOps Pattern: How to keep Node.js or Python apps alive without PM2",
          "analogy": "Imagine hiring a night watchman and giving them written instructions: 'Watch this door. If the door ever blows open (app crashes), close it immediately. If it blows open 10 times in a minute, sound the alarm.' A `.service` file is those exact instructions for Linux!",
          "whyItMatters": "Many developers rely on PM2 or screen, which break easily on server reboots. A native Systemd service is 100% resilient, uses 0 extra RAM, and restarts automatically if your app crashes.",
          "keyConcept": "Anatomy of `/etc/systemd/system/myapp.service`:\n```ini\n[Unit]\nDescription=My Web Application\nAfter=network.target\n\n[Service]\nType=simple\nUser=ubuntu\nWorkingDirectory=/opt/myapp\nExecStart=/usr/bin/node server.js\nRestart=always\nRestartSec=5s\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target\n```\n- `After=network.target`: Don't start until internet/network is ready.\n- `Restart=always`: If the app crashes, restart it automatically!\n- `RestartSec=5s`: Wait 5 seconds before restarting (prevents infinite CPU loops).",
          "commands": [
            {
              "cmd": "sudo nano /etc/systemd/system/myapp.service",
              "explain": "Creates the systemd service definition file."
            },
            {
              "cmd": "sudo systemctl daemon-reload",
              "explain": "Tells Systemd to read and register new or edited service files."
            },
            {
              "cmd": "sudo systemctl enable --now myapp",
              "explain": "Enables the new custom service on boot and starts it immediately."
            }
          ],
          "exercise": {
            "title": "Write and Register a Systemd Unit File",
            "objective": "Practice writing a systemd configuration file.",
            "steps": [
              "1. Write out the 3 main sections of a systemd unit file: [Unit], [Service], [Install].",
              "2. What directive tells systemd to automatically revive a crashed process?",
              "3. Why must you run `systemctl daemon-reload` after editing a service file?"
            ],
            "testCommand": "echo '[Unit] [Service] [Install] verified'",
            "solution": "1. [Unit], [Service], [Install]\n2. Restart=always (with RestartSec=5s)\n3. daemon-reload instructs systemd to scan /etc/systemd/system/ and reload changed unit files into memory.",
            "solutionExplanation": "Systemd caches service unit definitions in memory; changes to disk files require daemon-reload to take effect."
          }
        },
        {
          "id": "m2-l4",
          "title": "Inspecting Service Logs with Journalctl",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 11 (Troubleshooting & Log analysis)",
          "analogy": "Think of `journalctl` like the flight data recorder (black box) of an airplane. Every time a service starts, stops, errors, or prints text to the screen, Systemd records the exact microsecond in the journal.",
          "whyItMatters": "When a service fails to start with 'Job for myapp.service failed', running `journalctl -u myapp.service -xe` tells you the exact error line in seconds.",
          "keyConcept": "The 4 Essential Journalctl Flags:\n- `journalctl -u <service>`: Filter logs for only that specific service.\n- `-f` (Follow): Stream logs live in real-time as they happen (like `tail -f`).\n- `-n 50`: Show only the last 50 lines.\n- `--since '1 hour ago'`: Show logs from the past hour.\n- `-e` (End): Jump straight to the bottom of the log file.",
          "commands": [
            {
              "cmd": "journalctl -u docker -f -n 50",
              "explain": "Streams the last 50 log lines from the Docker daemon in real-time."
            },
            {
              "cmd": "journalctl -u nginx --since '30 minutes ago'",
              "explain": "Shows Nginx service logs from the last half hour."
            },
            {
              "cmd": "journalctl -p err -b",
              "explain": "Shows all high-priority errors that occurred during the current boot."
            }
          ],
          "exercise": {
            "title": "Inspect Real-time System Logs",
            "objective": "Practice querying system logs using journalctl.",
            "steps": [
              "1. Run `journalctl -n 20` to view the last 20 log entries on the system.",
              "2. What flag allows you to view logs streaming live in real-time?",
              "3. How do you filter logs strictly to errors (`-p err`)?"
            ],
            "testCommand": "journalctl -n 5 2>/dev/null || echo 'journalctl inspected'",
            "solution": "journalctl -n 20\n# Use -f to follow logs in real-time.\njournalctl -p err -b",
            "solutionExplanation": "Journalctl centralizes kernel, boot, and service output into a structured, queryable binary log."
          }
        }
      ]
    },
    {
      "id": "module-3",
      "number": 3,
      "title": "Linux Storage, Inodes & Disk Hygiene",
      "days": "Days 7 - 9",
      "level": "Intermediate",
      "icon": "Database",
      "description": "Prevent production disk crashes. Understand filesystems, the Inode limit nightmare, finding rogue heavy files, and stopping Docker logs from filling your SSD.",
      "lessons": [
        {
          "id": "m3-l1",
          "title": "Linux Disks, Partitions & Mount Points",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 1.5 (fallocate /swapfile) & Section 9 (backups volume mount)",
          "analogy": "Think of a hard drive like a new piece of land. A 'partition' is building a fence to divide the land into lots. Formatting with ext4 is laying concrete and roads. 'Mounting' is putting a signpost saying: 'This lot is now /opt/sama'.",
          "whyItMatters": "Cloud servers often have an OS disk (40GB) and attachable block storage (100GB+). If you don't understand mount points, you might save backups to the tiny OS disk and crash your server!",
          "keyConcept": "Key Storage Tools:\n- `lsblk`: List block devices (shows all physical disks, partitions, and where they are mounted).\n- `df -h`: Disk Free (shows percentage used on each mounted disk).\n- `/etc/fstab`: Filesystem Table (the master list of what drives get mounted where on server boot).",
          "commands": [
            {
              "cmd": "lsblk",
              "explain": "Lists all storage devices, partitions, sizes, and mountpoints in a tree view."
            },
            {
              "cmd": "df -h",
              "explain": "Shows disk space usage in human-readable gigabytes."
            }
          ],
          "exercise": {
            "title": "Inspect Mounted Filesystems and Disks",
            "objective": "Practice inspecting drive partitions and mount points.",
            "steps": [
              "1. Run `df -h` and look at the line mounted on `/`.",
              "2. Run `lsblk` to view storage blocks.",
              "3. What percentage of disk usage should trigger an emergency alert in production?"
            ],
            "testCommand": "df -h /",
            "solution": "df -h\nlsblk\n# Any disk above 85% usage should trigger alerts. Above 95%, databases stop writing to prevent corruption.",
            "solutionExplanation": "PostgreSQL and other ACID databases will panic and shut down when disk space runs out to protect against WAL journal corruption."
          }
        },
        {
          "id": "m3-l2",
          "title": "The Inode Nightmare (Disk Full with 20GB Free!)",
          "timeEstimate": "50 mins",
          "deployRef": "Production Gotcha: npm cache, sessions, and temp files exhausting inodes",
          "analogy": "Imagine a parking lot with 1,000 parking spaces. But the parking attendant only printed 100 ticket stubs (Inodes). Even if you have 900 empty parking spaces, nobody can park because there are no tickets left! Inodes are the ticket stubs of the filesystem.",
          "whyItMatters": "Every single file and folder on Linux consumes exactly ONE Inode. If an app creates 500,000 tiny 10-byte cache or session files, `df -h` will say 'You have 30GB free!', but the OS returns 'No space left on device'! You MUST check `df -i`.",
          "keyConcept": "Inodes explained:\n- An Inode stores file metadata (size, owner, permissions, disk location).\n- Total Inodes are set when the drive is formatted and cannot be increased easily.\n- Command to check: `df -i` (shows Inode count and % used).\n- If Inodes reach 100%, you cannot create even a 1-byte file!",
          "commands": [
            {
              "cmd": "df -i",
              "explain": "Shows Inode capacity and percentage used for each filesystem."
            }
          ],
          "exercise": {
            "title": "Inspect System Inode Usage",
            "objective": "Learn how to diagnose Inode exhaustion.",
            "steps": [
              "1. Run `df -i` in your terminal.",
              "2. Note the 'IUse%' column.",
              "3. Explain how a million 1-byte files can break a server even with 50GB of free space."
            ],
            "testCommand": "df -i /",
            "solution": "df -i\n# A million 1-byte files consume 1 million Inodes. When Inodes reach 100%, the OS cannot allocate new metadata, causing 'No space left on device'.",
            "solutionExplanation": "Inode exhaustion is common in Node.js applications with rogue node_modules or uncleaned session directories."
          }
        },
        {
          "id": "m3-l3",
          "title": "Finding What Eats Your Disk (du & ncdu)",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 9 (Line 221: find backups -mtime +30 -delete)",
          "analogy": "When your bedroom is messy, you don't throw everything away. You look for the biggest heavy boxes taking up floor space. `du` (Disk Usage) finds the heaviest folders on your server.",
          "whyItMatters": "When your disk hits 95% full, you need to find the offending folder in 30 seconds to prevent a crash. `du -sh * | sort -h` is the ultimate DevOps rescue command.",
          "keyConcept": "The Disk Hunter Commands:\n- `du -sh *`: Disk Usage - Summarize (`-s`) in Human-readable (`-h`) for every folder in the current directory.\n- `du -sh * | sort -h`: Sorts from smallest to biggest so the heaviest hog is at the very bottom!\n- `sudo find /var/log -type f -size +100M`: Finds all log files larger than 100 Megabytes.",
          "commands": [
            {
              "cmd": "sudo du -sh /var/* 2>/dev/null | sort -h",
              "explain": "Finds the largest subdirectories inside /var."
            },
            {
              "cmd": "sudo find / -type f -size +500M 2>/dev/null",
              "explain": "Finds all single files on the entire server larger than 500MB."
            }
          ],
          "exercise": {
            "title": "Find Heavy Folders Using du and sort",
            "objective": "Practice locating large directories on Linux.",
            "steps": [
              "1. Run `du -sh /tmp 2>/dev/null` to check the size of /tmp.",
              "2. Run `du -sh * 2>/dev/null | sort -h` in your project folder to find the heaviest folder.",
              "3. Why is `sort -h` useful when paired with `du`?"
            ],
            "testCommand": "du -sh /tmp 2>/dev/null || echo 'du inspected'",
            "solution": "du -sh *\ndu -sh * | sort -h\n# sort -h understands human units (K, M, G) and places the largest directories at the bottom of the output.",
            "solutionExplanation": "Using sort -h prevents 10G from being sorted before 2M, correctly sorting human-readable sizes."
          }
        },
        {
          "id": "m3-l4",
          "title": "The Silent Disk Killer: Docker Logs & Logrotate",
          "timeEstimate": "55 mins",
          "deployRef": "deploy.md Section 10 (Line 243: docker image prune -f)",
          "analogy": "If you never empty your office paper shredder, in 3 months the room will fill to the ceiling with shredded paper. Docker containers output logs to JSON files that GROW FOREVER by default until the disk is 100% full!",
          "whyItMatters": "A container running for 6 months can generate a 35GB log file in `/var/lib/docker/containers/`. Every production Docker host MUST configure log rotation in `/etc/docker/daemon.json`.",
          "keyConcept": "Limiting Docker Container Logs Globally:\nCreate or edit `/etc/docker/daemon.json`:\n```json\n{\n  \"log-driver\": \"json-file\",\n  \"log-opts\": {\n    \"max-size\": \"20m\",\n    \"max-file\": \"3\"\n  }\n}\n```\n- `max-size: 20m`: A container log file will never exceed 20MB.\n- `max-file: 3`: Keeps only 3 rotated files (total 60MB max per container forever!).",
          "commands": [
            {
              "cmd": "sudo cat /etc/docker/daemon.json 2>/dev/null || echo 'No config'",
              "explain": "Inspects current Docker daemon logging configuration."
            },
            {
              "cmd": "docker image prune -f",
              "explain": "Removes untagged, dangling images to reclaim SSD disk space."
            }
          ],
          "exercise": {
            "title": "Understand Docker Log Rotation Configuration",
            "objective": "Learn how to prevent Docker from exhausting disk space.",
            "steps": [
              "1. Explain what happens to Docker container stdout logs if no log-driver options are configured.",
              "2. What do `max-size` and `max-file` enforce?",
              "3. Write the JSON configuration block to limit logs to 50MB and 2 files."
            ],
            "testCommand": "echo '{\"log-opts\": {\"max-size\": \"50m\", \"max-file\": \"2\"}}'",
            "solution": "{\n  \"log-driver\": \"json-file\",\n  \"log-opts\": {\n    \"max-size\": \"50m\",\n    \"max-file\": \"2\"\n  }\n}",
            "solutionExplanation": "Setting max-size and max-file caps log growth and prevents runaway disk space exhaustion."
          }
        }
      ]
    },
    {
      "id": "module-4",
      "number": 4,
      "title": "Bash Scripting for DevOps Automation",
      "days": "Days 10 - 12",
      "level": "Intermediate",
      "icon": "FileCode",
      "description": "Write robust, fail-safe bash scripts for deployments, backups, and health checks. Learn defensive scripting with 'set -euo pipefail', exit codes, and logic.",
      "lessons": [
        {
          "id": "m4-l1",
          "title": "Anatomy of a Production Bash Script",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 9.2 (Lines 218-222: backup shell script) & aaPanel Cron",
          "analogy": "A bash script is like a cooking recipe. Instead of typing 20 commands into the terminal by hand every morning, you write the recipe into a `.sh` file and tell Linux: 'Execute this exact recipe step by step!'",
          "whyItMatters": "DevOps is automation. If you manually type deployment commands, you will eventually make a typo and break production. Writing scripts eliminates human error.",
          "keyConcept": "Key Script Components:\n1. **The Shebang (`#!/usr/bin/env bash`)**: The very first line. Tells Linux which interpreter to run the script with.\n2. **Executable Permission**: Scripts must have execute permissions (`chmod +x script.sh`).\n3. **Running the script**: `./script.sh` or `bash script.sh`.",
          "commands": [
            {
              "cmd": "chmod +x backup.sh",
              "explain": "Makes the script executable by the owner."
            },
            {
              "cmd": "./backup.sh",
              "explain": "Runs the script in the current directory."
            }
          ],
          "exercise": {
            "title": "Write Your First Executable Shell Script",
            "objective": "Create, permission, and execute a simple automation script.",
            "steps": [
              "1. Create a script `/tmp/hello.sh` with `#!/usr/bin/env bash` and `echo 'Hello DevOps'`. ",
              "2. Run `chmod +x /tmp/hello.sh`.",
              "3. Execute `/tmp/hello.sh`."
            ],
            "testCommand": "bash -c \"echo '#!/usr/bin/env bash\necho DevOps Ready' > /tmp/test_sh.sh && chmod +x /tmp/test_sh.sh && /tmp/test_sh.sh && rm /tmp/test_sh.sh\"",
            "solution": "echo '#!/usr/bin/env bash\necho DevOps Ready' > /tmp/hello.sh\nchmod +x /tmp/hello.sh\n/tmp/hello.sh",
            "solutionExplanation": "The shebang #!/usr/bin/env bash ensures that the script runs with Bash regardless of the user's default login shell."
          }
        },
        {
          "id": "m4-l2",
          "title": "Defensive Scripting: set -euo pipefail",
          "timeEstimate": "50 mins",
          "deployRef": "Production Best Practice: Why shell scripts must fail safely",
          "analogy": "Imagine an automated car with no emergency brakes. If a wheel falls off, it just keeps driving into a wall! By default, Bash behaves like that: if step 2 fails, it blindly continues to step 3 and can delete the wrong directory. `set -euo pipefail` installs emergency brakes on every single command!",
          "whyItMatters": "Consider this disaster: `rm -rf /opt/sama/$BRANCH`. If `$BRANCH` is empty/undefined due to a typo, Bash runs `rm -rf /opt/sama/` and deletes the entire production app! With `set -u`, Bash aborts immediately because the variable was undefined.",
          "keyConcept": "The 3 Golden Defensive Flags:\n- `set -e`: Exit immediately if any command exits with a non-zero status (an error).\n- `set -u`: Exit immediately if an undefined variable is referenced (prevents empty variable disasters!).\n- `set -o pipefail`: In a pipeline (`cmd1 | cmd2`), if `cmd1` fails, the whole script fails (normally Bash only checks the exit code of the LAST command in the pipe!).",
          "commands": [
            {
              "cmd": "set -euo pipefail",
              "explain": "The ultimate defensive bash header. Place at the top of every DevOps script."
            }
          ],
          "exercise": {
            "title": "Test Defensive Scripting Failures",
            "objective": "Observe how set -u prevents referencing undefined variables.",
            "steps": [
              "1. What does `set -e` do when a command fails?",
              "2. What does `set -u` do when an unbound variable is read?",
              "3. Why is `set -o pipefail` critical in `docker compose logs | grep error`?"
            ],
            "testCommand": "bash -c 'set -u; echo $UNDEFINED_VAR' 2>&1 | grep -i 'unbound'",
            "solution": "1. set -e halts execution immediately on command error.\n2. set -u halts execution if an undefined variable is evaluated.\n3. pipefail ensures the pipe fails if the left-side command (docker compose) fails.",
            "solutionExplanation": "Defensive bash scripting stops silent failures from corrupting state or executing dangerous commands."
          }
        },
        {
          "id": "m4-l3",
          "title": "Variables, Exit Codes ($?) & Logic (&& vs ||)",
          "timeEstimate": "55 mins",
          "deployRef": "deploy.md Section 9.2 (Lines 220-221: ... pg_dump ... && find ... -delete)",
          "analogy": "Think of an exit code like a traffic light. Green light (code 0) means 'Everything succeeded, proceed!' Red light (code 1 to 255) means 'Error! Stop!' The `&&` symbol says: 'Only proceed if the light was Green.'",
          "whyItMatters": "In deploy.md: `docker compose ... pg_dump ... && find ... -delete`. Notice the `&&`! It ensures old backups are deleted ONLY IF the new backup was created with exit code 0. If `pg_dump` fails, `&&` halts and preserves your old backups!",
          "keyConcept": "Logic and Exit Codes:\n- `$?`: Special variable holding the exit code of the most recent command (0 = success, anything else = failure).\n- `command1 && command2`: Runs command2 ONLY IF command1 succeeded.\n- `command1 || command2`: Runs command2 ONLY IF command1 failed (used for error handling: `cmd || echo 'Failed!'`).\n- Variables: `DATE=$(date +%F)` captures command output into a variable.",
          "commands": [
            {
              "cmd": "echo $?",
              "explain": "Prints the exit status code of the last command."
            },
            {
              "cmd": "date +%F",
              "explain": "Prints current date in YYYY-MM-DD format."
            },
            {
              "cmd": "mkdir /tmp/test && echo 'Success!' || echo 'Failed!'",
              "explain": "Conditional execution based on exit status."
            }
          ],
          "exercise": {
            "title": "Test Exit Codes and Conditional Logic",
            "objective": "Practice using $? and chaining commands with && and ||.",
            "steps": [
              "1. Run `ls /valid_path 2>/dev/null; echo $?` (check exit code).",
              "2. Run `ls /invalid_path_12345 2>/dev/null; echo $?` (observe non-zero exit code).",
              "3. Explain why `&&` is used in deploy.md between pg_dump and find -delete."
            ],
            "testCommand": "ls /tmp >/dev/null && echo 'Exit code was 0'",
            "solution": "ls /tmp; echo $?\nls /fake_dir 2>/dev/null; echo $?\n# && ensures old backups are deleted ONLY IF the new dump completed with exit code 0.",
            "solutionExplanation": "Using && prevents data loss by guaranteeing that cleanup actions only occur after successful creation of the new backup."
          }
        },
        {
          "id": "m4-l4",
          "title": "Writing a Production Healthcheck Script",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 7 (Line 154: curl -s http://127.0.0.1:4200/api/v1/health)",
          "analogy": "Imagine an automated telephone that calls your server every 60 seconds and asks: 'Are you alive?' If the server responds with 'Yes (200 OK)', it hangs up happily. If the server does not answer, it sounds the siren!",
          "whyItMatters": "Deploying is only half the battle. You need an automated script that tests your HTTP endpoints, checks if the response is HTTP 200, and verifies JSON health status.",
          "keyConcept": "Using curl in scripts:\n- `curl -s`: Silent mode (doesn't print download progress bars).\n- `curl -o /dev/null`: Discards the HTML/body output.\n- `curl -w '%{http_code}'`: Prints ONLY the HTTP status code (e.g. 200, 502).\n\nExample Healthcheck script:\n```bash\nSTATUS=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:4200/api/v1/health)\nif [ \"$STATUS\" -eq 200 ]; then\n  echo \"Service Healthy!\"\n  exit 0\nelse\n  echo \"CRITICAL: Service returned $STATUS\"\n  exit 1\nfi\n```",
          "commands": [
            {
              "cmd": "curl -s -o /dev/null -w \"%{http_code}\" https://sama.seddiqi.co",
              "explain": "Fetches and prints strictly the HTTP status code."
            }
          ],
          "exercise": {
            "title": "Write an HTTP Healthcheck Probe",
            "objective": "Practice capturing HTTP status codes in bash scripts.",
            "steps": [
              "1. Run `curl -s -o /dev/null -w '%{http_code}' https://google.com`.",
              "2. Write a bash `if` condition to verify that the status equals 200.",
              "3. What exit code should a health probe script return when the service is down?"
            ],
            "testCommand": "curl -s -o /dev/null -w '%{http_code}\n' https://google.com",
            "solution": "STATUS=$(curl -s -o /dev/null -w '%{http_code}' https://google.com)\nif [ \"$STATUS\" -eq 200 ] || [ \"$STATUS\" -eq 301 ]; then\n  echo 'Service OK'\n  exit 0\nelse\n  echo 'Service DOWN'\n  exit 1\nfi",
            "solutionExplanation": "Returning exit code 1 allows monitoring systems (like Nagios, Datadog, or GitHub Actions) to detect service outages automatically."
          }
        }
      ]
    },
    {
      "id": "module-5",
      "number": 5,
      "title": "Cloud Servers, Networking & Virtual Cloud Networks",
      "days": "Days 13 - 15",
      "level": "Beginner to Intermediate",
      "icon": "Cloud",
      "description": "Understand Oracle Cloud instances, static reserved public IPs, cloud security lists, and Linux iptables dual-layer firewalling.",
      "lessons": [
        {
          "id": "m5-l1",
          "title": "Cloud Virtual Machines & CPU Architecture (x86 vs ARM)",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 1.1 (Line 39: Shape: at least 2 OCPU and 4 GB... Ampere A1 ARM)",
          "analogy": "Think of CPU architecture like languages. Intel/AMD chips speak x86. Apple Silicon and Oracle Ampere chips speak ARM. If you build a Docker image that only understands x86 and try to run it on an ARM server, it will crash. Knowing your architecture is crucial!",
          "whyItMatters": "Oracle Cloud provides a generous Free Tier with Ampere A1 (ARM64) up to 4 cores and 24GB RAM. You must ensure your Docker images support ARM64 (`linux/arm64`).",
          "keyConcept": "Key Concepts:\n- **VPS (Virtual Private Server)**: A virtual slice of a huge physical server in a data center.\n- **Static / Reserved Public IP vs Ephemeral IP**: An ephemeral IP changes every time you restart your VM. If your IP changes, your domain DNS breaks! A **Reserved Public IP** is permanently locked to your server forever.",
          "commands": [
            {
              "cmd": "uname -m",
              "explain": "Prints your CPU architecture: x86_64 (Intel/AMD) or aarch64 (ARM64)."
            },
            {
              "cmd": "curl ifconfig.me",
              "explain": "Queries an external service to print your server public IPv4 address."
            }
          ],
          "exercise": {
            "title": "Check Your CPU Architecture and Public IP",
            "objective": "Verify your server architecture to know whether you need ARM64 or AMD64 Docker images.",
            "steps": [
              "1. Run `uname -m` in your terminal.",
              "2. Check if the output is `x86_64` or `aarch64` (or `arm64`).",
              "3. Why is an Ephemeral IP dangerous for hosting a website?"
            ],
            "testCommand": "uname -m",
            "solution": "uname -m\n# If it says aarch64, you are on ARM. If x86_64, you are on Intel/AMD.",
            "solutionExplanation": "An ephemeral IP gets released back to the cloud pool when the instance stops. A reserved IP ensures your domain DNS always points to the correct machine."
          }
        },
        {
          "id": "m5-l2",
          "title": "Cloud Firewalls, Security Lists & CIDR Blocks",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 1.3 (Line 42: Networking -> VCN -> Security Lists -> Ingress Rules)",
          "analogy": "Think of Cloud Security Lists like the guard booth at the front gate of a gated community. Even before anyone reaches your house door (your server), the gate guard checks if their IP address and port are allowed.",
          "whyItMatters": "If port 80/443 is blocked in Oracle Cloud Security List, traffic never even reaches your server. Conversely, if you leave your database port 5432 open to 0.0.0.0/0, automated hackers will brute-force your passwords.",
          "keyConcept": "Understanding CIDR notation:\n- `0.0.0.0/0`: Means ANY IP address on Earth (the entire public internet). Used for public web traffic (ports 80 and 443).\n- `<your-ip>/32`: The `/32` means exactly ONE single IP address (your office or home computer). Used for administrative panels (like aaPanel port 7800 or 8888) so hackers cannot even load the login screen!",
          "commands": [
            {
              "cmd": "Ingress Rule: Source 0.0.0.0/0, TCP 80, 443",
              "explain": "Allows all web browsers to visit your website over HTTP and HTTPS."
            },
            {
              "cmd": "Ingress Rule: Source YOUR_IP/32, TCP aaPanel_PORT",
              "explain": "Allows only your home/office computer to connect to the administration panel."
            }
          ],
          "exercise": {
            "title": "Calculate CIDR IP Rules for Admin Access",
            "objective": "Practice designing secure ingress firewall rules.",
            "steps": [
              "1. Find your current public IP address using `curl -s ifconfig.me`.",
              "2. Formulate the /32 CIDR notation for that IP.",
              "3. Write the rule parameters to open port 8888 for only that IP."
            ],
            "testCommand": "curl -s ifconfig.me",
            "solution": "MY_IP=$(curl -s ifconfig.me)\necho \"Allowed Ingress: Source ${MY_IP}/32, Protocol TCP, Destination Port 8888\"",
            "solutionExplanation": "Restricting administrative ports to /32 protects your server from 99.9% of automated port scanners."
          }
        }
      ]
    },
    {
      "id": "module-6",
      "number": 6,
      "title": "Host Firewalls (UFW & iptables) & Port Diagnostics",
      "days": "Days 16 - 17",
      "level": "Intermediate",
      "icon": "Shield",
      "description": "Master host packet filtering with iptables and UFW, understand rule ordering, save rules with netfilter-persistent, and diagnose listening ports with ss.",
      "lessons": [
        {
          "id": "m6-l1",
          "title": "Simple Firewalling with UFW (Uncomplicated Firewall)",
          "timeEstimate": "45 mins",
          "deployRef": "Standard Ubuntu Alternative to iptables",
          "analogy": "If iptables is like programming assembly language, UFW is like high-level Python. It gives you simple, human-readable commands like 'ufw allow 80' instead of complicated table chains.",
          "whyItMatters": "Most production Ubuntu VPS servers use UFW. You can lock down all ports in 3 simple commands without making mistakes.",
          "keyConcept": "The 4-Step UFW Setup:\n1. `sudo ufw default deny incoming`: Block all incoming connections by default.\n2. `sudo ufw default allow outgoing`: Let the server connect out to the internet (for apt, docker).\n3. `sudo ufw allow 22/tcp`: CRITICAL: Allow SSH so you don't lock yourself out!\n4. `sudo ufw allow 80/tcp && sudo ufw allow 443/tcp`: Allow web traffic.\n5. `sudo ufw enable`: Turn on the firewall.",
          "commands": [
            {
              "cmd": "sudo ufw status verbose",
              "explain": "Checks active UFW firewall rules and status."
            },
            {
              "cmd": "sudo ufw allow 80/tcp",
              "explain": "Opens HTTP port 80."
            },
            {
              "cmd": "sudo ufw allow from 1.2.3.4 to any port 8888 proto tcp",
              "explain": "Opens port 8888 strictly to your specific IP address."
            }
          ],
          "exercise": {
            "title": "Simulate UFW Firewall Configuration",
            "objective": "Practice setting up a default-deny firewall policy.",
            "steps": [
              "1. What command must ALWAYS be run before `ufw enable` to avoid locking yourself out?",
              "2. Write the command to allow HTTPS port 443.",
              "3. How do you whitelist a specific IP address for port 22?"
            ],
            "testCommand": "echo 'ufw allow 22/tcp' && echo 'ufw allow 443/tcp'",
            "solution": "sudo ufw allow 22/tcp\nsudo ufw allow 443/tcp\nsudo ufw allow from YOUR_IP to any port 22 proto tcp",
            "solutionExplanation": "Always allow SSH before enabling a firewall, or your active terminal connection will be severed."
          }
        },
        {
          "id": "m6-l2",
          "title": "Linux Host Firewall with iptables & netfilter-persistent",
          "timeEstimate": "60 mins",
          "deployRef": "deploy.md Section 1.4 (Lines 49-51: sudo iptables -I INPUT 6 ...)",
          "analogy": "Oracle Cloud Ubuntu images have TWO locks on the door. The first lock is the Cloud Security List (the front gate). The second lock is `iptables` inside Ubuntu itself! If you open port 80 in Oracle Cloud but forget iptables in Ubuntu, your website still will NOT open!",
          "whyItMatters": "Many developers spend 3 days frustrated because their site won't load, unaware that Oracle Ubuntu includes default iptables rules rejecting all incoming traffic except SSH (port 22).",
          "keyConcept": "Demystifying the deploy.md command:\n`sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT`\n\nLet us break down every piece:\n- `-I INPUT 6`: Insert this rule into the INPUT chain at position 6 (before the final REJECT rule at line 7!).\n- `-m state --state NEW`: Match new incoming connection requests.\n- `-p tcp`: The protocol is TCP (web traffic).\n- `--dport 80`: Destination port 80 (HTTP).\n- `-j ACCEPT`: Jump to ACCEPT (allow the packet in).\n\nAnd `sudo netfilter-persistent save`: Saves the rules to `/etc/iptables/rules.v4`. If you do not run this, your rules disappear on reboot!",
          "commands": [
            {
              "cmd": "sudo iptables -L INPUT --line-numbers",
              "explain": "Lists all current incoming firewall rules with their line numbers."
            },
            {
              "cmd": "sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT",
              "explain": "Allows incoming HTTP traffic at line 6."
            },
            {
              "cmd": "sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT",
              "explain": "Allows incoming HTTPS traffic at line 6."
            },
            {
              "cmd": "sudo netfilter-persistent save",
              "explain": "Saves rules permanently so they persist after reboot."
            }
          ],
          "exercise": {
            "title": "Inspect iptables Chains and Understand Rule Ordering",
            "objective": "Learn how firewall rule positions work in Linux.",
            "steps": [
              "1. Explain why inserting at line 6 (`-I INPUT 6`) matters in Oracle Ubuntu.",
              "2. What happens if you append a rule to the very end (`-A INPUT`) when the last rule is `REJECT`?",
              "3. What command is required to make iptables rules survive a server reboot?"
            ],
            "testCommand": "echo 'netfilter-persistent save'",
            "solution": "1. Rule 6 inserts the rule before the default REJECT rule.\n2. If you append (-A) after REJECT, the packet gets rejected before your rule is ever evaluated!\n3. sudo netfilter-persistent save",
            "solutionExplanation": "Firewall rules are evaluated sequentially from top to bottom. Once a packet matches a rule (like REJECT), evaluation stops immediately."
          }
        },
        {
          "id": "m6-l3",
          "title": "Network Diagnostics & Port Binding (127.0.0.1 vs 0.0.0.0)",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 7 & 8 (Line 14: 127.0.0.1:4200 web & Line 180: proxy_pass)",
          "analogy": "Think of IP address bindings like phone lines in an office building. `0.0.0.0` is the direct telephone line connected to the public city network (anyone on the internet can call it). `127.0.0.1` (localhost/loopback) is the private intercom inside room 4200. Only people already inside the building (like Nginx) can speak to it!",
          "whyItMatters": "Sama's Next.js container binds to `127.0.0.1:4200`. This is a critical security pattern! It means hackers on the internet CANNOT connect to Next.js or PostgreSQL directly. They can ONLY talk to Nginx on port 80/443, which acts as the security guard.",
          "keyConcept": "Port Binding Rules:\n- `0.0.0.0:4200`: Listens on ALL interfaces. Publicly exposed to the internet!\n- `127.0.0.1:4200`: Listens ONLY on loopback. Accessible only by local processes on the same machine.\n- No published port (like PostgreSQL in docker-compose.prod.yml): Only reachable by other containers in the same Docker internal network!",
          "commands": [
            {
              "cmd": "sudo ss -tulpn",
              "explain": "Socket Statistics: Lists all listening TCP/UDP ports, IP bindings, and process names."
            },
            {
              "cmd": "curl -I http://127.0.0.1:4200",
              "explain": "Tests if the local service is responding on loopback port 4200."
            },
            {
              "cmd": "sudo lsof -i :80",
              "explain": "Shows exactly which process (e.g. nginx) is currently holding port 80."
            }
          ],
          "exercise": {
            "title": "Check Listening Ports with ss",
            "objective": "Practice inspecting active network sockets.",
            "steps": [
              "1. Run `ss -tulpn` (or `netstat -tuln`).",
              "2. Identify the difference between a service listening on `*:22` or `0.0.0.0:80` vs `127.0.0.1:4200`.",
              "3. Test connecting to a local port with `curl -v http://127.0.0.1:80`."
            ],
            "testCommand": "ss -tulpn 2>/dev/null || netstat -tuln 2>/dev/null || echo 'Command inspected'",
            "solution": "ss -tulpn\ncurl -Iv http://127.0.0.1",
            "solutionExplanation": "Binding to 127.0.0.1 creates an architectural perimeter where only reverse proxies on the host can communicate with the upstream app."
          }
        }
      ]
    },
    {
      "id": "module-7",
      "number": 7,
      "title": "Domains, DNS & Production Email Deliverability",
      "days": "Days 18 - 19",
      "level": "Intermediate",
      "icon": "Globe",
      "description": "Master DNS record types (A, CNAME, TXT), subdomains, TTL propagation, dig diagnostics, SMTP relays, and the anti-spam triad: SPF, DKIM, and DMARC.",
      "lessons": [
        {
          "id": "m7-l1",
          "title": "DNS Architecture & The A Record",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 3 (Lines 80-93: The address: DNS at Hostinger)",
          "analogy": "Think of DNS like the Contacts app in your phone. You don't memorize your friend IP address '140.238.15.22'. You type 'sama.seddiqi.co', and DNS translates that friendly name into the real computer IP address.",
          "whyItMatters": "If your DNS is misconfigured, nobody in the world can reach your server. Understanding TTL prevents 24-hour downtime when you change servers.",
          "keyConcept": "Core DNS Records:\n- **A Record**: Maps a domain/subdomain to an IPv4 address (e.g., `sama` points to `140.238.15.22`).\n- **CNAME**: Maps a name to another name (e.g., `www` points to `sama.seddiqi.co`).\n- **TXT**: Stores arbitrary text for verification (used for SPF, DKIM, Google verification).\n- **TTL (Time to Live)**: The number of seconds other DNS servers cache your IP. Setting TTL to `300` (5 minutes) before a migration allows fast updates!",
          "commands": [
            {
              "cmd": "dig +short sama.seddiqi.co",
              "explain": "Quickly asks DNS servers for the IP of sama.seddiqi.co and prints only the IP."
            },
            {
              "cmd": "dig sama.seddiqi.co A +trace",
              "explain": "Traces the full DNS journey from Root nameservers -> .co TLD -> Hostinger nameservers -> your IP."
            }
          ],
          "exercise": {
            "title": "Query Public Domains with dig",
            "objective": "Practice querying DNS records and understanding TTL values.",
            "steps": [
              "1. Run `dig +short google.com` to see the A record IP.",
              "2. Run `dig google.com` and look at the ANSWER SECTION to find the TTL number.",
              "3. Why did deploy.md recommend setting TTL to 300 instead of 86400?"
            ],
            "testCommand": "dig +short google.com",
            "solution": "dig +short google.com\ndig google.com\n# 300 seconds TTL means if you change your server IP, the change propagates in 5 minutes instead of 24 hours (86400 seconds).",
            "solutionExplanation": "Low TTL allows rapid switching during migrations or outages. High TTL reduces DNS query traffic once your infrastructure is stable."
          }
        },
        {
          "id": "m7-l2",
          "title": "Subdomains vs Root Domains (Isolation Pattern)",
          "timeEstimate": "40 mins",
          "deployRef": "deploy.md Section 3.3 (Line 92: Your other records... seddiqi.co are not touched)",
          "analogy": "Imagine your main company building is at `seddiqi.co`. You want to open a new branch for Sama. Instead of moving the entire company, you just set up a signpost at `sama.seddiqi.co` pointing to your new Oracle server. The main website, company emails, and other services stay untouched!",
          "whyItMatters": "A junior mistake is pointing the entire root domain (`@`) to a new server and accidentally breaking the company main website or destroying all incoming business emails.",
          "keyConcept": "The Subdomain Rule:\nCreating an A record with Host name `sama` creates a separate branch: `sama.seddiqi.co`. The root domain (`@` or `seddiqi.co`) still points to your main web host, and MX records (Mail eXchange) continue working without interruption.",
          "commands": [
            {
              "cmd": "dig +short seddiqi.co",
              "explain": "Checks the IP of the main website."
            },
            {
              "cmd": "dig +short sama.seddiqi.co",
              "explain": "Checks the IP of the Sama application server."
            }
          ],
          "exercise": {
            "title": "Simulate Subdomain Delegation",
            "objective": "Understand how subdomains isolate application traffic.",
            "steps": [
              "1. Check the MX records for a domain using `dig -t MX google.com`.",
              "2. Explain why adding an A record for `sama` does not change MX records for `@`.",
              "3. What record type would you use if you wanted `api.sama.seddiqi.co` to point directly to `sama.seddiqi.co`?"
            ],
            "testCommand": "dig -t MX google.com",
            "solution": "dig -t MX google.com\n# A CNAME record can point api.sama.seddiqi.co to sama.seddiqi.co.",
            "solutionExplanation": "DNS records are hierarchical. Subdomain records (sama.seddiqi.co) are independent sibling entries in the zone file and do not overwrite root records."
          }
        },
        {
          "id": "m7-l3",
          "title": "SMTP Relay & Ports (465 SSL vs 587 STARTTLS)",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 4 (Lines 98-102: Note the SMTP settings: smtp.hostinger.com:465)",
          "analogy": "Think of SMTP like the postal worker who picks up your letters. Port 25 is like an unsealed postcard (unencrypted, often blocked by cloud providers). Port 465 is an armored truck with an armed guard (implicit SSL encryption from the very first millisecond).",
          "whyItMatters": "Oracle Cloud and many VPS providers permanently block outgoing port 25 to prevent spam bots. If your app tries to send email on port 25, it hangs forever. Using port 465 (SSL) or 587 (TLS) with authentication is mandatory for production.",
          "keyConcept": "SMTP Settings Breakdown:\n- Host: `smtp.hostinger.com`\n- Port: `465` (SSL / SMTPS)\n- User: `no-reply@seddiqi.co`\n- URL-encoding: In connection strings (`smtps://user:pass@host:465`), the `@` in the email username MUST be written as `%40`. Otherwise, the parser gets confused by having two `@` symbols!",
          "commands": [
            {
              "cmd": "openssl s_client -connect smtp.hostinger.com:465 -quiet",
              "explain": "Tests if your server can establish a secure encrypted handshake with the SMTP mail server."
            }
          ],
          "exercise": {
            "title": "Test an Encrypted SMTP Connection",
            "objective": "Verify that outbound SMTP ports are not blocked by your firewall.",
            "steps": [
              "1. Run `openssl s_client -connect smtp.gmail.com:465 -quiet` to see an SMTP banner.",
              "2. Type `QUIT` and press Enter to disconnect.",
              "3. Write a connection string for user `admin@domain.com` with password `p@ssword` where special characters are URL-encoded."
            ],
            "testCommand": "echo 'smtps://admin%40domain.com:p%40ssword@smtp.hostinger.com:465'",
            "solution": "smtps://admin%40domain.com:p%40ssword@smtp.hostinger.com:465\n# Note: @ is %40.",
            "solutionExplanation": "In URIs, the @ character is a reserved delimiter separating credentials from the hostname. Escaping it with %40 prevents parsing errors."
          }
        },
        {
          "id": "m7-l4",
          "title": "Email Deliverability Triad: SPF, DKIM & DMARC",
          "timeEstimate": "60 mins",
          "deployRef": "deploy.md Section 4.2 (Line 97: make sure SPF, DKIM and DMARC all show as set)",
          "analogy": "Imagine receiving a letter from a bank. 1) SPF is the bank publishing a public list of post offices authorized to send their letters. 2) DKIM is the bank official wax seal stamped with an unforgeable signature. 3) DMARC is the bank instruction to the mail carrier: 'If a letter arrives without our wax seal, throw it directly into the trash!'",
          "whyItMatters": "Without SPF, DKIM, and DMARC, Gmail, Outlook, and Yahoo will reject your confirmation emails or mark them as SPAM. Your users will never get their account confirmation codes!",
          "keyConcept": "The Anti-Spam Triad:\n1. **SPF (Sender Policy Framework)**: A TXT record listing IP addresses allowed to send email for your domain.\n   Example: `v=spf1 include:_spf.hostinger.com ~all`\n2. **DKIM (DomainKeys Identified Mail)**: The mail server signs every email with a private cryptographic key. The world verifies it using a public key published in your DNS TXT record.\n3. **DMARC**: Specifies policy if SPF or DKIM fails.\n   Example: `v=DMARC1; p=quarantine; pct=100`",
          "commands": [
            {
              "cmd": "dig -t TXT seddiqi.co",
              "explain": "Queries all TXT records to check the active SPF record."
            },
            {
              "cmd": "dig -t TXT _dmarc.seddiqi.co",
              "explain": "Queries the DMARC policy for the domain."
            }
          ],
          "exercise": {
            "title": "Inspect SPF and DMARC Records with dig",
            "objective": "Verify email security records of a public domain.",
            "steps": [
              "1. Run `dig -t TXT google.com` and locate the line starting with `v=spf1`.",
              "2. Run `dig -t TXT _dmarc.google.com` to see Google DMARC policy.",
              "3. Explain what `p=reject` means in a DMARC record."
            ],
            "testCommand": "dig -t TXT _dmarc.google.com",
            "solution": "dig -t TXT _dmarc.google.com\n# p=reject tells receiving mail servers (like Gmail/Yahoo) to completely reject any email claiming to come from google.com that fails SPF/DKIM verification.",
            "solutionExplanation": "DMARC closes the spoofing loophole by instructing recipient mail servers how strictly to enforce SPF and DKIM validation."
          }
        }
      ]
    },
    {
      "id": "module-8",
      "number": 8,
      "title": "Git, SSH Cryptography & Secure Server Access",
      "days": "Days 20 - 21",
      "level": "Intermediate",
      "icon": "Shield",
      "description": "Master asymmetric SSH key generation with Ed25519, GitHub Deploy Keys (least privilege), SSH daemon hardening, and Fail2ban intrusion protection.",
      "lessons": [
        {
          "id": "m8-l1",
          "title": "SSH Deep Dive & Asymmetric Cryptography (Ed25519)",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 5 (Line 115: ssh-keygen -t ed25519 -C sama-server -f ~/.ssh/id_ed25519 -N '')",
          "analogy": "Think of an SSH key pair like a lock and a key. Your **Public Key** (`id_ed25519.pub`) is an open padlock. You can give copies of this padlock to anyone in the world (GitHub, Linux servers). Your **Private Key** (`id_ed25519`) is the physical key that stays in your pocket. Only the holder of the private key can open the padlock!",
          "whyItMatters": "Passwords can be guessed or brute-forced by automated bots. SSH keys use 256-bit elliptic curve math that would take trillions of years to crack. Ed25519 is faster and more secure than older RSA keys.",
          "keyConcept": "Breaking down the keygen command:\n`ssh-keygen -t ed25519 -C sama-server -f ~/.ssh/id_ed25519 -N ''`\n- `-t ed25519`: Use the modern Edwards-curve Digital Signature Algorithm.\n- `-C sama-server`: Add a helpful label/comment so you know which server this key belongs to.\n- `-f ~/.ssh/id_ed25519`: Specifies the file path to save the key.\n- `-N ''`: Set an empty passphrase (crucial for automated server deployments so background scripts do not hang waiting for a human to type a password!).",
          "commands": [
            {
              "cmd": "ssh-keygen -t ed25519 -C test-server -f ~/.ssh/test_key -N ''",
              "explain": "Generates a new ed25519 key pair with no passphrase."
            },
            {
              "cmd": "cat ~/.ssh/test_key.pub",
              "explain": "Prints the public key that you paste into GitHub or authorized_keys."
            },
            {
              "cmd": "chmod 600 ~/.ssh/test_key",
              "explain": "Ensures the private key is locked so SSH does not complain 'Permissions are too open'."
            }
          ],
          "exercise": {
            "title": "Generate an Ed25519 Key Pair",
            "objective": "Practice generating modern SSH keys and verifying permissions.",
            "steps": [
              "1. Run `ssh-keygen -t ed25519 -C demo-key -f /tmp/demo_key -N ''`.",
              "2. Inspect the public key using `cat /tmp/demo_key.pub`.",
              "3. Inspect permissions of the private key with `ls -l /tmp/demo_key`.",
              "4. Delete the temporary key with `rm /tmp/demo_key*`."
            ],
            "testCommand": "ssh-keygen -t ed25519 -C demo-key -f /tmp/demo_key -N '' && ls -l /tmp/demo_key.pub",
            "solution": "ssh-keygen -t ed25519 -C demo-key -f /tmp/demo_key -N ''\ncat /tmp/demo_key.pub\nrm /tmp/demo_key*",
            "solutionExplanation": "The private key must always have strict permissions (0600), or the ssh client will refuse to use it for security reasons."
          }
        },
        {
          "id": "m8-l2",
          "title": "GitHub Deploy Keys & Principle of Least Privilege",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 5 (Lines 111-113: read-only deploy key under Settings -> Deploy keys)",
          "analogy": "If you hire a painter to paint your kitchen, you don't give them the master key to your bank safe, your car, and your bedroom. You give them a key card that opens ONLY the kitchen door. A **Deploy Key** gives a server access to ONLY one single repository in READ-ONLY mode!",
          "whyItMatters": "If you put your personal GitHub Personal Access Token on a server and the server ever gets compromised, the attacker can access ALL of your private GitHub repositories. A read-only Deploy Key limits the blast radius to zero.",
          "keyConcept": "Deploy Key Rules:\n1. Created under **Repository -> Settings -> Deploy keys** (NOT under your personal user account profile!).\n2. Leave 'Allow write access' UNCHECKED. A production server only needs to pull code, never push code.\n3. The server can now run `git clone git@github.com:user/repo.git` cleanly.",
          "commands": [
            {
              "cmd": "ssh -T git@github.com",
              "explain": "Tests if your SSH key is recognized by GitHub. Prints: 'Hi user/repo! You've successfully authenticated...'"
            },
            {
              "cmd": "git clone git@github.com:Khsed4/sama.git /opt/sama",
              "explain": "Clones the private repository over SSH into /opt/sama."
            }
          ],
          "exercise": {
            "title": "Understand Least Privilege in Deployments",
            "objective": "Identify security risks in CI/CD and deployment credentials.",
            "steps": [
              "1. Explain why using a personal account token on a server violates the Principle of Least Privilege.",
              "2. What error does GitHub return if you attempt to push code with a read-only deploy key?",
              "3. How do you test GitHub SSH authentication without cloning a repository?"
            ],
            "testCommand": "ssh -T -o StrictHostKeyChecking=no git@github.com 2>&1 | head -n 1",
            "solution": "ssh -T git@github.com\n# A read-only deploy key will return 'ERROR: Key does not have permission to push code' if a git push is attempted.",
            "solutionExplanation": "Read-only deploy keys guarantee that a compromised production machine cannot inject malicious code back into your source repository."
          }
        },
        {
          "id": "m8-l3",
          "title": "Hardening the Linux SSH Daemon",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 12 (Line 267: SSH only with keys: PasswordAuthentication no in /etc/ssh/sshd_config)",
          "analogy": "Leaving password authentication enabled on port 22 is like leaving a door with a 4-digit lock on a busy street. Thousands of botnets try combinations 24 hours a day. Turning off password authentication completely removes the lock and requires an unforgeable physical key (SSH key).",
          "whyItMatters": "99% of automated server attacks are botnets attempting password brute-forcing on port 22. Disabling password authentication instantly stops them in their tracks.",
          "keyConcept": "Critical `/etc/ssh/sshd_config` directives:\n- `PasswordAuthentication no`: Completely disables typing passwords to log in.\n- `PermitRootLogin no`: Forbids logging in directly as the superuser `root`. You must log in as `ubuntu` and use `sudo`.\n- `PubkeyAuthentication yes`: Enables SSH key authentication.\n\nWARNING: Always verify that your SSH key works in a second terminal window BEFORE restarting sshd, so you never lock yourself out!",
          "commands": [
            {
              "cmd": "sudo nano /etc/ssh/sshd_config",
              "explain": "Opens the SSH daemon configuration file."
            },
            {
              "cmd": "sudo sshd -t",
              "explain": "Tests the configuration file for syntax errors before restarting."
            },
            {
              "cmd": "sudo systemctl restart ssh",
              "explain": "Restarts the SSH service to apply the new hardening rules."
            }
          ],
          "exercise": {
            "title": "Audit SSH Configuration Directives",
            "objective": "Practice checking SSH configuration parameters safely.",
            "steps": [
              "1. Run `sshd -T | grep passwordauthentication` to see if password logins are currently allowed.",
              "2. Run `sshd -T | grep permitrootlogin` to check root login status.",
              "3. Why is `sshd -t` a critical safety command before restarting ssh?"
            ],
            "testCommand": "sshd -T 2>/dev/null | grep -E 'passwordauthentication|permitrootlogin' || echo 'Audited'",
            "solution": "sshd -T | grep -E 'passwordauthentication|permitrootlogin'\n# sshd -t checks for syntax typos that could crash the SSH server and lock you out permanently.",
            "solutionExplanation": "Using sshd -t (test mode) verifies configuration syntax so a typo will not kill the daemon on restart."
          }
        },
        {
          "id": "m8-l4",
          "title": "Automated Intrusion Defense with Fail2ban",
          "timeEstimate": "45 mins",
          "deployRef": "Essential Linux Hardening Companion for SSH and Web Services",
          "analogy": "Think of Fail2ban like an alert bouncer outside a private club. If a stranger tries 5 fake keys in a row at the door, the bouncer immediately handcuffs them and bans them from the street for 24 hours!",
          "whyItMatters": "Even with key authentication, thousands of automated bot connection attempts fill your `/var/log/auth.log` and waste CPU cycles. Fail2ban blocks attacking IPs at the Linux firewall level.",
          "keyConcept": "How Fail2ban works:\n1. Watches `/var/log/auth.log` for failed SSH attempts.\n2. When an IP fails `maxretry = 5` times within `findtime = 10m`:\n3. Fail2ban dynamically adds an iptables DROP rule for that IP for `bantime = 1h`.\n4. Status check: `sudo fail2ban-client status sshd`.",
          "commands": [
            {
              "cmd": "sudo apt install -y fail2ban",
              "explain": "Installs the Fail2ban intrusion prevention daemon."
            },
            {
              "cmd": "sudo fail2ban-client status sshd",
              "explain": "Shows currently banned IP addresses and total blocked attacks."
            },
            {
              "cmd": "sudo fail2ban-client set sshd unbanip 1.2.3.4",
              "explain": "Manually unbans an accidental lockout IP."
            }
          ],
          "exercise": {
            "title": "Inspect Fail2ban Service Status",
            "objective": "Learn how to query active IP bans.",
            "steps": [
              "1. Explain the roles of `findtime`, `maxretry`, and `bantime` in Fail2ban.",
              "2. How does Fail2ban block attacking IPs (which Linux subsystem does it modify)?",
              "3. Write the command to check how many IPs Fail2ban has currently blocked."
            ],
            "testCommand": "echo 'fail2ban-client status sshd'",
            "solution": "1. maxretry (failed attempts) within findtime (window) triggers bantime (duration).\n2. It dynamically injects DROP rules into iptables / nftables.\n3. sudo fail2ban-client status sshd",
            "solutionExplanation": "Fail2ban operates at layer 3/4 by modifying packet filter tables dynamically based on application log parsing."
          }
        }
      ]
    },
    {
      "id": "module-9",
      "number": 9,
      "title": "Environment Variables, Secrets & Database Users",
      "days": "Days 22 - 23",
      "level": "Intermediate",
      "icon": "Key",
      "description": "Understand 12-Factor App configs, high-entropy secret generation with openssl, URL encoding passwords, and multi-user PostgreSQL privilege isolation.",
      "lessons": [
        {
          "id": "m9-l1",
          "title": "The 12-Factor App & Secret Management",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 6 (Lines 120-126: cp .env.example .env && chmod 600 .env)",
          "analogy": "Think of your source code like a car engine. The engine is identical for everyone. But the fuel (the .env file) is different: in development, you use test fuel; in production, you use high-octane production fuel with real passwords. You NEVER build the fuel into the engine blueprints (Git repository)!",
          "whyItMatters": "Accidentally pushing a `.env` file with real database credentials to GitHub can get your server hijacked in under 5 minutes by scraping bots.",
          "keyConcept": "The Rule of Two Files:\n1. `.env.example`: Committed to Git. Contains fake dummy values (`POSTGRES_PASSWORD=change_me`) to show teammates what variables are needed.\n2. `.env`: NEVER committed to Git (listed in `.gitignore`). Contains the real, secret production passwords on the server.",
          "commands": [
            {
              "cmd": "cp .env.example .env",
              "explain": "Copies the template to create the actual environment file."
            },
            {
              "cmd": "chmod 600 .env",
              "explain": "Locks the file so only your user account can read or write it."
            }
          ],
          "exercise": {
            "title": "Create and Secure an Environment File",
            "objective": "Practice setting up an environment file securely.",
            "steps": [
              "1. Create a dummy `.env.example` with `DB_PASS=example_pass`.",
              "2. Copy it to `.env` using `cp .env.example .env`.",
              "3. Lock it with `chmod 600 .env`.",
              "4. Verify the permissions using `ls -l .env`."
            ],
            "testCommand": "cp /dev/null /tmp/test.env && chmod 600 /tmp/test.env && ls -l /tmp/test.env",
            "solution": "touch .env.example\ncp .env.example .env\nchmod 600 .env\nls -l .env",
            "solutionExplanation": "The 600 permission grants rw------- ensuring that unauthorized system processes or local users cannot read database passwords."
          }
        },
        {
          "id": "m9-l2",
          "title": "High-Entropy Secrets & URL-Encoding",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 6 (Lines 128-137: Make each password with openssl rand -hex 24... URL-encode)",
          "analogy": "If your password is 'password123', a hacker dictionary can crack it in 1 millisecond. If your password is `7a9e3f81bc20...` generated by cryptographic randomness, it would take the world's fastest supercomputers billions of years to guess.",
          "whyItMatters": "Connection strings look like `postgresql://user:password@host:5432/db`. If your password contains `@` or `/` or `#`, the parser thinks the `@` is the end of the password! That is why deploy.md says to use `openssl rand -hex 24` (which ONLY produces letters a-f and numbers 0-9), preventing all syntax bugs!",
          "keyConcept": "Key Concepts:\n- `openssl rand -hex 24`: Generates 24 bytes of true cryptographic randomness formatted as 48 hexadecimal characters (0-9, a-f).\n- URL Encoding: If your SMTP password has special symbols, you must escape them (e.g., `@` becomes `%40`, `/` becomes `%2F`).",
          "commands": [
            {
              "cmd": "openssl rand -hex 24",
              "explain": "Generates a 48-character unbreakable random password with no special characters."
            }
          ],
          "exercise": {
            "title": "Generate Production Passwords with OpenSSL",
            "objective": "Generate multiple secure cryptographic passwords for your database and app.",
            "steps": [
              "1. Run `openssl rand -hex 24` three times to generate passwords for `POSTGRES_PASSWORD`, `APP_DB_PASSWORD`, and `VENDOR_DB_PASSWORD`.",
              "2. Why is hex-encoding safer than passwords containing symbols like `@` or `#` in connection strings?"
            ],
            "testCommand": "openssl rand -hex 24",
            "solution": "openssl rand -hex 24\n# Hex strings consist strictly of [0-9a-f] and never break URI connection strings like postgresql://user:pass@host/db.",
            "solutionExplanation": "Hexadecimal characters are URI-safe, eliminating connection string parsing crashes caused by unescaped delimiters."
          }
        },
        {
          "id": "m9-l3",
          "title": "Multi-Role Database Security (Owner vs App vs Vendor)",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 6 (Table in Section 6: POSTGRES_PASSWORD, APP_DB_PASSWORD, VENDOR_DB_PASSWORD)",
          "analogy": "In a company, the CEO (Owner) has keys to every room and the safe. The cashier (App User) only has access to the cash register. The auditor (Vendor User) only has access to financial reports. If the cashier is robbed, the robber CANNOT access the master safe!",
          "whyItMatters": "If your API database user has `SUPERUSER` privileges and your API has an SQL injection flaw, the attacker can drop the entire database, alter tables, or read system files. Sama uses 3 separate users with isolated permissions.",
          "keyConcept": "The 3 Database Roles in Sama:\n1. `POSTGRES_PASSWORD` (Owner `sama`): Used ONLY by migration containers to alter table schemas and add columns.\n2. `APP_DB_PASSWORD` (`sama_app`): Used by the public NestJS API for daily queries (SELECT, INSERT, UPDATE, DELETE). Cannot drop tables!\n3. `VENDOR_DB_PASSWORD` (`sama_vendor`): Used strictly by the internal vendor management portal.",
          "commands": [
            {
              "cmd": "docker compose exec postgres psql -U sama -c \"\\du\"",
              "explain": "Lists all database users and their roles/privileges inside PostgreSQL."
            }
          ],
          "exercise": {
            "title": "Understand Database Privilege Separation",
            "objective": "Learn the security rationale behind multi-role database configurations.",
            "steps": [
              "1. Identify the three database users configured in `docker-compose.prod.yml`.",
              "2. Which container uses the owner credentials?",
              "3. Why should the public-facing API (`api`) never run as the PostgreSQL superuser?"
            ],
            "testCommand": "echo 'Multi-role database security understood'",
            "solution": "1. sama (owner), sama_app (API), sama_vendor (admin).\n2. The migrate container uses the owner credentials.\n3. The public API is restricted so an SQL injection vulnerability cannot DROP tables or modify database schemas.",
            "solutionExplanation": "Database role isolation ensures that a compromised application runtime cannot perform destructive DDL operations."
          }
        }
      ]
    },
    {
      "id": "module-10",
      "number": 10,
      "title": "Production Docker & Multi-Stage Builds",
      "days": "Days 24 - 25",
      "level": "Intermediate to Advanced",
      "icon": "Box",
      "description": "Master multi-stage Dockerfiles, image optimization, non-root USER security, Docker Compose YAML anchors, healthchecks, and run-once migration containers.",
      "lessons": [
        {
          "id": "m10-l1",
          "title": "Multi-Stage Dockerfiles (Reducing 1.5GB to 150MB)",
          "timeEstimate": "60 mins",
          "deployRef": "deploy.md & Dockerfile (Lines 4-15: AS build, Line 17: AS api, Line 34: AS web)",
          "analogy": "Think of building a car in a factory. The factory has heavy cranes, welding machines, and huge drills. But when the customer drives the car away, they do not take the welding cranes with them! Multi-stage builds use a heavy stage to compile code, then copy ONLY the final lightweight binary into a tiny production container.",
          "whyItMatters": "A single-stage Node image with pnpm, compilers, and devDependencies is over 1.5GB. A multi-stage Next.js standalone container is only ~150MB! Smaller images build faster, deploy faster, and have 90% fewer security vulnerabilities.",
          "keyConcept": "How deploy/Dockerfile works:\n1. Stage 1 (`FROM node:24-slim AS build`): Installs all dependencies, builds the Nx monorepo, compiles Next.js and NestJS.\n2. Stage 2 (`FROM node:24-slim AS api`): Copies ONLY `apps/api/dist` and compiled node_modules from the build stage.\n3. Stage 3 (`FROM node:24-slim AS web`): Copies ONLY `.next/standalone` and static assets. No compiler tools inside!",
          "commands": [
            {
              "cmd": "docker build --target api -t sama-api:latest -f deploy/Dockerfile .",
              "explain": "Builds only the API target from the multi-stage Dockerfile."
            },
            {
              "cmd": "docker images",
              "explain": "Lists built images and their sizes on disk."
            }
          ],
          "exercise": {
            "title": "Analyze Multi-Stage Build Targets",
            "objective": "Understand how --target allows one Dockerfile to produce multiple distinct production images.",
            "steps": [
              "1. Inspect `deploy/Dockerfile`.",
              "2. Identify the three `FROM` stages: `build`, `api`, and `web`.",
              "3. Explain what `COPY --from=build` does in the `web` stage."
            ],
            "testCommand": "head -n 20 deploy/Dockerfile 2>/dev/null || echo 'Dockerfile inspected'",
            "solution": "Stage 1 (build) compiles the entire workspace.\nStage 2 (api) and Stage 3 (web) copy only the compiled artifacts using COPY --from=build.",
            "solutionExplanation": "Multi-stage builds decouple the build-time toolchain from the runtime environment, resulting in lean and secure production images."
          }
        },
        {
          "id": "m10-l2",
          "title": "Container Security (Non-Root Users) & HEALTHCHECK",
          "timeEstimate": "50 mins",
          "deployRef": "deploy/Dockerfile (Line 27: USER node & Line 29: HEALTHCHECK)",
          "analogy": "If a burglar breaks into your house, you don't want them to find the master keys to the city jail and power plant. In Linux, the `root` user can do anything. Running containers as `USER node` ensures that even if an attacker hacks your Node.js app, they CANNOT touch host system files or escape the container!",
          "whyItMatters": "Docker containers share the host Linux kernel. Running as root inside a container makes container breakouts significantly easier for attackers.",
          "keyConcept": "Container Best Practices:\n- `USER node`: Drops root privileges before running the server.\n- `HEALTHCHECK`: Docker monitors the container health continuously. If the app deadlocks or stops answering, Docker marks it 'unhealthy' so other dependent services know not to send traffic to it.",
          "commands": [
            {
              "cmd": "docker inspect --format='{{json .State.Health}}' <container_id>",
              "explain": "Inspects the detailed health check status and logs for a container."
            }
          ],
          "exercise": {
            "title": "Understand Docker Healthcheck Directives",
            "objective": "Examine healthcheck parameters: interval, timeout, retries, and start-period.",
            "steps": [
              "1. Look at line 29 of `deploy/Dockerfile`.",
              "2. What is `interval=30s`?",
              "3. What is `start-period=30s` and why is it needed for Node.js apps?"
            ],
            "testCommand": "echo 'Healthcheck inspected'",
            "solution": "1. interval=30s: Docker runs the health probe every 30 seconds.\n2. timeout=5s: If the app does not respond within 5 seconds, the probe fails.\n3. start-period=30s: Gives the Node.js app 30 seconds to boot up before counting healthcheck failures.",
            "solutionExplanation": "Start-period prevents Docker from prematurely marking a container as unhealthy while it is still initializing its database connection pool."
          }
        },
        {
          "id": "m10-l3",
          "title": "Docker Compose v2 & YAML Anchors (DRY Configuration)",
          "timeEstimate": "55 mins",
          "deployRef": "deploy/docker-compose.prod.yml (Lines 5-8: x-database-urls: &database-urls & Line 42: <<: *database-urls)",
          "analogy": "Imagine writing an email to 5 people where the meeting address is 10 lines long. Instead of typing it 5 times, you define a shortcut: `[ADDRESS] = ...` and then write `*ADDRESS` in each email. YAML Anchors let you define database URLs once and reuse them across multiple services without copy-pasting!",
          "whyItMatters": "Copy-pasting database URLs across 4 services leads to typos where one service connects to the wrong database. YAML Anchors (`&name`) and Aliases (`*name`) keep your Docker Compose DRY (Don't Repeat Yourself).",
          "keyConcept": "Docker Compose Power Features in deploy.md:\n- `&database-urls`: Defines the anchor.\n- `<<: *database-urls`: The merge key merges those variables into the current service environment.\n- `depends_on: { postgres: { condition: service_healthy } }`: The API will NOT start until PostgreSQL is fully booted and passing its healthcheck!",
          "commands": [
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml config",
              "explain": "Validates the YAML syntax and displays the fully resolved, merged configuration."
            }
          ],
          "exercise": {
            "title": "Validate Docker Compose Syntax with config",
            "objective": "Practice testing Docker Compose files before deploying.",
            "steps": [
              "1. Run `docker compose -f deploy/docker-compose.prod.yml config` in the Sama project root.",
              "2. Look at how `*database-urls` was expanded into actual environment variables for `migrate` and `api`.",
              "3. Explain how `condition: service_healthy` prevents connection refused errors."
            ],
            "testCommand": "docker compose -f deploy/docker-compose.prod.yml config 2>&1 | head -n 25 || echo 'Compose checked'",
            "solution": "docker compose -f deploy/docker-compose.prod.yml config\n# The config command resolves all YAML anchors and checks for syntax errors.",
            "solutionExplanation": "Using depends_on with condition: service_healthy prevents race conditions where the backend boots before the database is ready to accept connections."
          }
        },
        {
          "id": "m10-l4",
          "title": "Ephemeral Containers & Database Migrations",
          "timeEstimate": "50 mins",
          "deployRef": "deploy/docker-compose.prod.yml (Lines 28-36: migrate service) & deploy.md Section 7 (Line 160: docker compose run --rm)",
          "analogy": "Think of an ephemeral container like a moving truck. When you move houses, the moving truck arrives, unloads your furniture, and drives away. You don't leave the moving truck parked in your living room forever! The `migrate` container runs your database schema updates and exits cleanly with code 0.",
          "whyItMatters": "Running migrations directly inside your persistent API container can lead to split-brain states if multiple API instances start simultaneously. Using a dedicated, short-lived migration container guarantees that database schemas update first.",
          "keyConcept": "The Migration Flow:\n1. `postgres` starts and becomes healthy.\n2. `migrate` container boots up, runs `prisma migrate deploy` and role setup script, and exits (`restart: 'no'`).\n3. `api` waits for `migrate` to complete successfully (`condition: service_completed_successfully`).\n4. `web` waits for `api` to be healthy, then starts serving users!",
          "commands": [
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml run --rm migrate node prisma/operator.ts admin@example.com \"Admin User\"",
              "explain": "Runs a one-off operator creation script inside the migration container and removes the container when done (--rm)."
            }
          ],
          "exercise": {
            "title": "Trace the Startup Sequence",
            "objective": "Understand service dependency ordering in production.",
            "steps": [
              "1. Write down the 4-step sequence: postgres -> migrate -> api -> web.",
              "2. What happens if `migrate` fails with an invalid password?",
              "3. Does the `web` container start if `api` is unhealthy?"
            ],
            "testCommand": "echo 'Startup sequence traced'",
            "solution": "1. postgres boots -> migrate runs and exits -> api boots -> web boots.\n2. If migrate fails (exit code 1), api never starts, preventing the app from running against an outdated or broken database schema.\n3. No, web waits for api to be healthy.",
            "solutionExplanation": "Dependency chaining creates a resilient deployment gate that halts the release before broken code touches production traffic."
          }
        }
      ]
    },
    {
      "id": "module-11",
      "number": 11,
      "title": "Nginx, Reverse Proxies, SSL & HTTP Protocols",
      "days": "Days 26 - 27",
      "level": "Intermediate to Advanced",
      "icon": "Server",
      "description": "Master Nginx reverse proxying, HTTP status code taxonomy, client header forwarding (X-Forwarded-For), Let's Encrypt SSL, and curl diagnostics.",
      "lessons": [
        {
          "id": "m11-l1",
          "title": "HTTP Status Code Taxonomy for DevOps",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 11 (502 Bad Gateway troubleshooting)",
          "analogy": "HTTP status codes are the universal hand signals of the internet. 200 is a thumbs up ('All good!'). 301 is an arrow pointing to a new street ('We moved!'). 400 is shaking your head at the customer ('You asked for something impossible'). 500 is the chef slipping on the kitchen floor ('Our server broke!').",
          "whyItMatters": "When an outage occurs, knowing whether an error is 4xx (client's fault) or 5xx (server's fault), and whether it was generated by Nginx (502/504) or Node.js (500), saves hours of blind debugging.",
          "keyConcept": "The 4 Critical Status Code Families:\n- **200 OK / 201 Created**: Successful request.\n- **301 Moved Permanently**: HTTP redirected to HTTPS. Cached by browsers aggressively!\n- **401 Unauthorized vs 403 Forbidden**: 401 means 'You need to log in first.' 403 means 'I know who you are, but you are not allowed in this room!'\n- **500 vs 502 vs 504**:\n  - 500: Node.js/NestJS code threw an uncaught error.\n  - 502 Bad Gateway: Nginx is working, but the Docker container (127.0.0.1:4200) is down or refusing connections!\n  - 504 Gateway Timeout: Docker container accepted the connection, but took longer than `proxy_read_timeout 120s` to respond.",
          "commands": [
            {
              "cmd": "curl -s -I https://sama.seddiqi.co | head -n 1",
              "explain": "Prints the exact HTTP status line of the web server."
            }
          ],
          "exercise": {
            "title": "Diagnose Origin of 502 vs 504 Status Codes",
            "objective": "Identify the difference between upstream connection failure and upstream timeout.",
            "steps": [
              "1. What is the difference between a 502 Bad Gateway and a 504 Gateway Timeout?",
              "2. If Nginx returns 502, which container should you inspect with `docker compose ps`?",
              "3. If Nginx returns 504, what Nginx directive governs the timeout threshold?"
            ],
            "testCommand": "echo '502 = Connection Refused; 504 = Read Timeout'",
            "solution": "1. 502 means the upstream container was unreachable or stopped. 504 means the container accepted the request but did not answer before timeout.\n2. Inspect the web client container (127.0.0.1:4200).\n3. proxy_read_timeout (set to 120s in deploy.md).",
            "solutionExplanation": "Knowing whether a failure occurred before connection (502) or during execution (504) instantly isolates the faulty component."
          }
        },
        {
          "id": "m11-l2",
          "title": "Reverse Proxying to Docker & Loopback Security",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Architecture Diagram (Lines 10-21: Browser -> aaPanel nginx -> 127.0.0.1:4200)",
          "analogy": "Think of Nginx like the receptionist in a corporate headquarters. Visitors (browsers) never walk straight into the executive office (Docker container). They talk to the receptionist, who checks their credentials (SSL), blocks intruders, and directs them to room 4200.",
          "whyItMatters": "Node.js is great at application logic, but terrible at handling raw TLS handshakes, buffering slow network connections, and dropping malicious traffic. Nginx can handle 100,000 concurrent requests using minimal memory, shielding Node.js completely.",
          "keyConcept": "Reverse Proxy Architecture:\n- In Sama: Nginx is the ONLY software listening on port 80 and 443. All backend containers sit safely behind it on loopback (`127.0.0.1`).",
          "commands": [
            {
              "cmd": "sudo nginx -t",
              "explain": "Tests Nginx configuration files for syntax errors before reloading."
            },
            {
              "cmd": "sudo nginx -s reload",
              "explain": "Gracefully reloads Nginx configuration with zero downtime for active users."
            }
          ],
          "exercise": {
            "title": "Test Nginx Configuration Syntax",
            "objective": "Practice checking Nginx syntax safely.",
            "steps": [
              "1. Explain why running `nginx -t` before `nginx -s reload` is mandatory on production servers.",
              "2. What status code does Nginx return if the backend container is stopped?"
            ],
            "testCommand": "echo 'nginx -t checked'",
            "solution": "1. nginx -t verifies all brackets, directives, and paths. If there is a typo, it warns you before you reload, preventing web server downtime.\n2. Nginx returns 502 Bad Gateway if the upstream container is down.",
            "solutionExplanation": "A 502 Bad Gateway indicates that Nginx is working correctly, but the service at target URL (127.0.0.1:4200) refused the connection."
          }
        },
        {
          "id": "m11-l3",
          "title": "The Critical Reverse Proxy Headers (X-Forwarded-For)",
          "timeEstimate": "60 mins",
          "deployRef": "deploy.md Section 8.4 (Lines 179-195: proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for)",
          "analogy": "Imagine an order delivered through 3 couriers. Courier A hands it to Courier B, who hands it to Courier C. When Courier C walks into your house, their badge says 'Courier B'. Without an `X-Forwarded-For` letter attached, you would have no idea who originally sent the package!",
          "whyItMatters": "Because Nginx proxies the request to Next.js (`127.0.0.1:4200`), Next.js sees every visitor IP as `127.0.0.1`. If Sama tries to rate-limit 'too many login attempts per IP', it would block the entire website for EVERYONE! The `X-Forwarded-For` header preserves the real visitor IP.",
          "keyConcept": "The 6 Essential Proxy Headers:\n1. `proxy_set_header Host $host;`: Passes the domain name requested by the browser (`sama.seddiqi.co`).\n2. `proxy_set_header X-Real-IP $remote_addr;`: The direct IP of the visitor.\n3. `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`: The complete chain of client IPs.\n4. `proxy_set_header X-Forwarded-Proto $scheme;`: Tells the app whether the user connected via `http` or `https` (critical for secure cookie validation!).\n5. `proxy_set_header Upgrade $http_upgrade;` & `Connection \"upgrade\"`: Enables WebSocket real-time communication.",
          "commands": [
            {
              "cmd": "curl -I -H \"X-Forwarded-Proto: https\" http://127.0.0.1:4200",
              "explain": "Simulates an Nginx reverse proxy request to test header handling."
            }
          ],
          "exercise": {
            "title": "Trace Why 'Too Many Attempts' Errors Happen",
            "objective": "Diagnose IP spoofing and rate-limiting issues in reverse proxies.",
            "steps": [
              "1. Read Section 11 of deploy.md (Row: 'Too many attempts for everyone').",
              "2. Explain why missing `X-Forwarded-For` causes this bug.",
              "3. Write the exact Nginx directive that fixes it."
            ],
            "testCommand": "echo 'proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;'",
            "solution": "proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n# Without this header, all visitors share the IP 127.0.0.1, exhausting the rate limit instantly.",
            "solutionExplanation": "Application rate-limiters rely on X-Forwarded-For to distinguish individual clients behind reverse proxies."
          }
        },
        {
          "id": "m11-l4",
          "title": "SSL/TLS & Automated Let's Encrypt Certificates",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 8.2 (Lines 171-172: Open the site SSL tab and choose Let's Encrypt)",
          "analogy": "Think of HTTP like sending a postcard with your password written on the back (anyone can read it in transit). Think of HTTPS like sealing your password inside a titanium safe with a combination that only you and the destination server know. Let's Encrypt is a free global charity that provides the titanium safes automatically!",
          "whyItMatters": "Browsers mark plain HTTP sites as 'Not Secure' and block cookies with the `Secure` flag. Sama uses HTTPS-only session cookies. Without SSL, logins will fail immediately!",
          "keyConcept": "How Let's Encrypt ACME works:\n1. Certbot / aaPanel contacts Let's Encrypt CA.\n2. **HTTP-01 Challenge**: Let's Encrypt places a temporary token file in `/.well-known/acme-challenge/`.\n3. Let's Encrypt downloads that file over the internet to prove you really own `sama.seddiqi.co`.\n4. Once verified, it issues a free 90-day X.509 TLS certificate.\n5. aaPanel configures auto-renewal at day 60, so your certificate never expires!",
          "commands": [
            {
              "cmd": "curl -Iv https://sama.seddiqi.co 2>&1 | grep -E \"expire|SSL certificate\"",
              "explain": "Inspects the active SSL certificate and its expiration date."
            }
          ],
          "exercise": {
            "title": "Inspect a Remote TLS Certificate with curl",
            "objective": "Practice verifying HTTPS connections and cipher suites.",
            "steps": [
              "1. Run `curl -Iv https://google.com 2>&1 | head -n 20`.",
              "2. Look for the TLS handshake (ALPN, server certificate, issuer).",
              "3. Why must port 80 be open for Let's Encrypt HTTP-01 renewal to succeed?"
            ],
            "testCommand": "curl -Iv https://google.com 2>&1 | grep -i 'SSL connection'",
            "solution": "curl -Iv https://google.com 2>&1 | grep -i 'SSL connection'\n# Port 80 is required because Let's Encrypt validates the ACME HTTP-01 challenge over port 80 before redirecting to 443.",
            "solutionExplanation": "Let's Encrypt verification begins on port 80 HTTP. If port 80 is blocked in your firewall, certificate renewals will fail."
          }
        }
      ]
    },
    {
      "id": "module-12",
      "number": 12,
      "title": "PostgreSQL Backups, Automation & Disaster Recovery",
      "days": "Days 28 - 29",
      "level": "Intermediate to Advanced",
      "icon": "Database",
      "description": "Master pg_dump custom format (-Fc), pg_restore, automated Linux cron jobs, 30-day retention policies, and offsite disaster recovery strategies.",
      "lessons": [
        {
          "id": "m12-l1",
          "title": "PostgreSQL Backup Architecture (pg_dump -Fc)",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 9.1 (Lines 209-210: pg_dump -U sama -Fc -f /backups/...)",
          "analogy": "If you take a photo of a moving car, the wheels look blurry. If you try to copy a raw database directory (`/var/lib/postgresql`) while the database is running, transactions are actively writing to disk and your backup will be corrupted! `pg_dump` takes an instantaneous, mathematically consistent snapshot of the entire database without stopping service.",
          "whyItMatters": "Hard drives fail, servers crash, and humans accidentally drop tables. A backup that you haven't tested restoring is NOT a backup. Knowing how to dump and restore in seconds saves your business.",
          "keyConcept": "Breaking down the pg_dump command:\n`docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U sama -Fc -f /backups/sama-$(date +%F).dump sama`\n- `exec -T`: Run inside the running `postgres` container without allocating a pseudo-TTY (`-T` is required in automated cron scripts!).\n- `-U sama`: Connect as the database owner `sama`.\n- `-Fc`: Custom compressed format. This is the gold standard! It compresses data, allows selective table restores, and supports parallel restoration.\n- `-f /backups/sama-$(date +%F).dump`: Saves to `/backups/sama-YYYY-MM-DD.dump` inside the container (which maps to `./backups` on the host!).",
          "commands": [
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml exec -T postgres pg_dump -U sama -Fc -f /backups/backup-test.dump sama",
              "explain": "Creates a compressed logical backup of the Sama database."
            },
            {
              "cmd": "ls -lh deploy/backups",
              "explain": "Lists all database dumps on the host machine and their sizes."
            }
          ],
          "exercise": {
            "title": "Simulate a PostgreSQL Database Backup",
            "objective": "Learn the exact command flags used in production database snapshots.",
            "steps": [
              "1. Explain what `$(date +%F)` expands to in Linux.",
              "2. Why is `-Fc` preferred over plain text `.sql` dumps?",
              "3. Why is the `-T` flag required in `docker compose exec -T` when running from cron?"
            ],
            "testCommand": "date +%F",
            "solution": "1. $(date +%F) produces the current date in YYYY-MM-DD format (e.g. 2026-10-22).\n2. -Fc is compressed, supports parallel multi-threaded restore, and allows restoring single tables.\n3. -T prevents 'the input device is not a TTY' error in non-interactive cron environments.",
            "solutionExplanation": "The -T flag disables pseudo-TTY allocation, allowing cron scripts and CI/CD pipelines to execute without terminal errors."
          }
        },
        {
          "id": "m12-l2",
          "title": "Automated Nightly Backups with Cron & 30-Day Retention",
          "timeEstimate": "55 mins",
          "deployRef": "deploy.md Section 9.2 (Lines 218-222: find /opt/sama/deploy/backups -name 'sama-*.dump' -mtime +30 -delete)",
          "analogy": "If you take a backup every night, in 3 years you will have 1,000 files taking up 500 Gigabytes of SSD space until your server hard drive fills to 100% and crashes! A retention policy is an automated janitor that deletes backups older than 30 days every night.",
          "whyItMatters": "Running out of disk space (`100% full`) causes PostgreSQL to stop immediately in panic mode to prevent data corruption. Automatic cleanup guarantees disk space remains stable forever.",
          "keyConcept": "Breaking down the Cron Script:\n1. Run `pg_dump` every night at 02:30 AM (when user traffic is lowest).\n2. `&&`: Only run cleanup if the backup succeeded!\n3. `find /opt/sama/deploy/backups -name 'sama-*.dump' -mtime +30 -delete`:\n   - `-name 'sama-*.dump'`: Only match backup files.\n   - `-mtime +30`: Modified time strictly older than 30 days.\n   - `-delete`: Remove those old files safely.",
          "commands": [
            {
              "cmd": "crontab -l",
              "explain": "Displays all active automated scheduled cron jobs for the current user."
            },
            {
              "cmd": "find /tmp -name \"*.dump\" -mtime +30",
              "explain": "Finds all dump files older than 30 days without deleting them (dry run)."
            }
          ],
          "exercise": {
            "title": "Understand Crontab Syntax and Retention Cleaning",
            "objective": "Practice schedule expressions and file cleanup filters.",
            "steps": [
              "1. What time does `30 2 * * *` execute?",
              "2. How would you change `-mtime +30` if you only wanted to keep 7 days of backups?",
              "3. Why is `&&` used instead of `;` between the dump command and the find command?"
            ],
            "testCommand": "echo '30 2 * * * cron syntax understood'",
            "solution": "1. 30 2 * * * runs at 02:30 AM every day.\n2. Use -mtime +7 to keep 7 days.\n3. && guarantees that old backups are deleted ONLY IF the new backup was created successfully without error.",
            "solutionExplanation": "Chaining with && prevents deleting historical backups if the current dump fails due to a full disk or database lock."
          }
        },
        {
          "id": "m12-l3",
          "title": "Database Restoration & The 3-2-1 Backup Rule",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 9.3 (Lines 226-234: pg_restore -U sama -d sama --clean --if-exists)",
          "analogy": "If your server burns down in a data center fire, having 30 backups stored on the same server SSD does you zero good! The 3-2-1 rule says: Keep **3** copies of your data, on **2** different types of storage, with **1** copy completely off-site in the cloud.",
          "whyItMatters": "A disaster recovery drill ensures that if ransomware hits or your server gets terminated by mistake, you can stand up a brand new server and be back online within 30 minutes.",
          "keyConcept": "The Restore Sequence:\n1. `docker compose stop api web`: Stop incoming requests so no new data is written.\n2. `pg_restore -U sama -d sama --clean --if-exists /backups/file.dump`:\n   - `--clean`: Drops existing tables before restoring.\n   - `--if-exists`: Does not crash if a table does not exist yet.\n3. `docker compose up -d`: Restart the app on the restored data!",
          "commands": [
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml stop api web",
              "explain": "Stops the web and API containers to prepare for database restoration."
            },
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml exec -T postgres pg_restore -U sama -d sama --clean --if-exists /backups/sama-latest.dump",
              "explain": "Restores the database cleanly from the specified dump file."
            },
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml up -d",
              "explain": "Restarts the web and API services on the restored data."
            }
          ],
          "exercise": {
            "title": "Trace the Disaster Recovery Workflow",
            "objective": "Practice the 3-step restoration procedure safely.",
            "steps": [
              "1. Why must `api` and `web` be stopped before running `pg_restore`?",
              "2. What do the flags `--clean --if-exists` do during restoration?",
              "3. What is an off-site backup target mentioned in deploy.md (e.g., Oracle Object Storage)?"
            ],
            "testCommand": "echo 'Disaster recovery steps verified'",
            "solution": "1. Stopping api and web prevents incoming user transactions from conflicting with the restore process.\n2. --clean drops old tables; --if-exists prevents errors if tables do not exist yet.\n3. Oracle Object Storage or an S3 bucket off the physical server.",
            "solutionExplanation": "Dropping existing objects with --clean prevents duplicate key collisions when restoring over an existing database schema."
          }
        }
      ]
    },
    {
      "id": "module-13",
      "number": 13,
      "title": "Zero-Downtime Updates, CI/CD & Launch Hardening",
      "days": "Day 30",
      "level": "Advanced",
      "icon": "RefreshCw",
      "description": "Master zero-downtime rolling updates, GitHub Actions automated CI/CD deployment, aaPanel internal file mappings, and the 7-step pre-flight production checklist.",
      "lessons": [
        {
          "id": "m13-l1",
          "title": "The Production Update Lifecycle",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 10 (Lines 236-245: Updating to a new version)",
          "analogy": "Think of an update like changing the tires on a race car during a pit stop. You do not scrap the car. The crew pulls new tires (git pull), builds the wheel assemblies (docker compose build), swaps them in seconds (docker compose up -d), and cleans the garage floor (image prune).",
          "whyItMatters": "Deploying updates improperly can take your website down for 20 minutes while Docker builds from scratch. Pre-building images before restarting containers minimizes downtime to less than 2 seconds.",
          "keyConcept": "The 5-Step Update Sequence in deploy.md:\n1. `cd /opt/sama && git pull`: Pull latest code changes over SSH.\n2. `cd deploy && docker compose build`: Build the new Docker images in the background while the OLD containers continue serving users!\n3. `docker compose up -d`: Docker swaps the old containers for the new ones in milliseconds. Migrations run first!\n4. `docker image prune -f`: Removes old untagged dangling images to reclaim SSD space.",
          "commands": [
            {
              "cmd": "cd /opt/sama && git pull",
              "explain": "Fetches and merges the latest code changes."
            },
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml build",
              "explain": "Pre-builds the new image layers before stopping any services."
            },
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml up -d",
              "explain": "Recreates containers with new images in seconds."
            },
            {
              "cmd": "docker image prune -f",
              "explain": "Cleans up outdated dangling image layers."
            }
          ],
          "exercise": {
            "title": "Understand Why Pre-Building Minimizes Downtime",
            "objective": "Compare bad deployment practices with the deploy.md sequence.",
            "steps": [
              "1. What happens if you run `docker compose down` BEFORE running `build`?",
              "2. How does running `docker compose build` first protect user uptime?",
              "3. Why must you run `docker image prune -f` after updates?"
            ],
            "testCommand": "echo 'Update lifecycle verified'",
            "solution": "1. If you take containers down first, your site is offline for the entire 10-20 minutes while Docker builds!\n2. Pre-building allows the old containers to keep serving traffic until the new images are 100% ready.\n3. Pruning prevents old images from eating all server disk space.",
            "solutionExplanation": "Pre-building images while existing containers run reduces user-facing downtime to a momentary container recreation window."
          }
        },
        {
          "id": "m13-l2",
          "title": "Automated Deployments with GitHub Actions CI/CD",
          "timeEstimate": "55 mins",
          "deployRef": "Modern Production Pipeline for deploy.md",
          "analogy": "Instead of you logging into the server with SSH every time you commit code, you hire a trusted robot (GitHub Actions). When you push code to GitHub, the robot logs in to your Linux server and runs the deployment commands for you automatically!",
          "whyItMatters": "Continuous Deployment (CD) saves hours of manual work every week and guarantees that whatever code is in GitHub `main` is running live in production.",
          "keyConcept": "How GitHub Actions Deploys to Linux:\n1. You store the server SSH Private Key in GitHub Secrets (`SSH_PRIVATE_KEY`).\n2. When you push to `main`, GitHub runs a workflow `.github/workflows/deploy.yml`:\n```yaml\nname: Deploy to Production\non: [push]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: appleboy/ssh-action@master\n        with:\n          host: ${{ secrets.SERVER_IP }}\n          username: ubuntu\n          key: ${{ secrets.SSH_PRIVATE_KEY }}\n          script: |\n            cd /opt/sama && git pull\n            cd deploy && docker compose -f docker-compose.prod.yml build\n            docker compose -f docker-compose.prod.yml up -d\n            docker image prune -f\n```",
          "commands": [
            {
              "cmd": "git push origin main",
              "explain": "Triggers the GitHub Actions deployment workflow automatically."
            }
          ],
          "exercise": {
            "title": "Design a GitHub Actions Deployment Workflow",
            "objective": "Understand how CI/CD pipelines automate the deploy.md sequence.",
            "steps": [
              "1. What secrets must be stored in GitHub Repository Secrets to enable SSH deployment?",
              "2. In what folder do GitHub Actions workflow files live?",
              "3. Why is using an SSH Deploy Key safer than personal credentials?"
            ],
            "testCommand": "echo '.github/workflows/deploy.yml'",
            "solution": "1. SERVER_IP, SSH_PRIVATE_KEY, and SSH_USER.\n2. In .github/workflows/\n3. An SSH Deploy Key isolates permissions to this single repository and server.",
            "solutionExplanation": "GitHub Actions automates repetitive shell tasks while keeping credentials securely encrypted in repository secrets."
          }
        },
        {
          "id": "m13-l3",
          "title": "The 5-Layer Debugging System (The Matrix)",
          "timeEstimate": "60 mins",
          "deployRef": "deploy.md Section 11 (Lines 248-258: When something is wrong matrix)",
          "analogy": "When your water stops running at home, you don't immediately dig up the city street with a bulldozer. You check: 1) Is the tap open? 2) Is the main valve open? 3) Did the pipes freeze? 4) Is the city water tower working? You debug layer by layer from outside to inside!",
          "whyItMatters": "When a site is down, panic leads to guessing. The 5-Layer Debugging System gives you a scientific checklist that locates any bug in under 3 minutes.",
          "keyConcept": "The 5 Layers to Check:\n- Layer 1 (DNS): Can the browser resolve the IP? (`dig +short sama.seddiqi.co`).\n- Layer 2 (Firewall): Are ports 80/443 open in OCI Security List and host `iptables`?\n- Layer 3 (Reverse Proxy / Nginx): Is Nginx running and returning 502 or 200?\n- Layer 4 (Containers): Are the containers `healthy` or `exited`? (`docker compose ps`).\n- Layer 5 (Application Logs): What is the exact error stack trace? (`docker compose logs --tail=100`).",
          "commands": [
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml ps",
              "explain": "Checks the running state and health status of all stack containers."
            },
            {
              "cmd": "docker compose -f deploy/docker-compose.prod.yml logs -f --tail=100 api web",
              "explain": "Streams real-time live logs from the API and Web containers."
            }
          ],
          "exercise": {
            "title": "Simulate Diagnosing a 502 Bad Gateway",
            "objective": "Practice using the 5-layer diagnostic sequence.",
            "steps": [
              "1. A user reports `502 Bad Gateway`. What does this indicate about Nginx vs Docker?",
              "2. What command would you immediately run to see if `web` or `api` crashed?",
              "3. If `migrate` exited with code 1, what log file should you inspect?"
            ],
            "testCommand": "echo '5-layer debugging matrix understood'",
            "solution": "1. 502 means Nginx is working fine, but the upstream container (127.0.0.1:4200) is stopped or refusing connections.\n2. docker compose ps\n3. docker compose logs migrate (usually indicates a wrong database password in .env).",
            "solutionExplanation": "Isolating whether an error originated at the edge proxy or the upstream application prevents wasted troubleshooting effort."
          }
        },
        {
          "id": "m13-l4",
          "title": "How aaPanel Works Under the Hood",
          "timeEstimate": "45 mins",
          "deployRef": "deploy.md Section 2.1 (Lines 67-71: Install aaPanel) & Section 8",
          "analogy": "aaPanel is not magic. It is simply a friendly website with buttons that edits Linux configuration files on your server for you. When you click 'Add Reverse Proxy' in aaPanel, it writes an Nginx config file in `/www/server/panel/vhost/nginx/` and runs `nginx -s reload` behind the scenes!",
          "whyItMatters": "If aaPanel ever crashes or gets locked, a real DevOps pro does not panic. You can edit the Nginx configuration files directly in the Linux terminal with `nano`.",
          "keyConcept": "Key Disk Locations in aaPanel:\n- Nginx virtual host configs: `/www/server/panel/vhost/nginx/`\n- SSL certificates: `/www/server/panel/vhost/cert/`\n- aaPanel internal CLI tool: `bt` command in terminal (used to reset panel passwords, change ports, and check panel status).",
          "commands": [
            {
              "cmd": "sudo bt",
              "explain": "Opens the aaPanel command-line troubleshooting menu (reset password, change port, restart panel)."
            }
          ],
          "exercise": {
            "title": "Understand aaPanel CLI Management",
            "objective": "Learn how to manage control panels via terminal when the web UI is unreachable.",
            "steps": [
              "1. What is the CLI command to manage aaPanel in the terminal?",
              "2. Where do the actual Nginx virtual host configurations live on disk?",
              "3. How do you recover access if you forget your aaPanel login path?"
            ],
            "testCommand": "echo 'sudo bt'",
            "solution": "1. sudo bt\n2. In /www/server/panel/vhost/nginx/\n3. Run sudo bt and select option 14 (or option 5/6) to view the panel URL, default entry path, and credentials.",
            "solutionExplanation": "The bt utility provides out-of-band console access to control panel settings if network firewalling or IP restrictions lock you out of the web interface."
          }
        },
        {
          "id": "m13-l5",
          "title": "The Final Production Security Checklist",
          "timeEstimate": "50 mins",
          "deployRef": "deploy.md Section 12 (Lines 265-274: Security checklist)",
          "analogy": "Before an airplane takes off with passengers, the pilots complete a 20-item pre-flight checklist. They don't guess. They check fuel, flaps, radios, and emergency gear. Section 12 of deploy.md is your pre-flight checklist before launching your application to real paying customers!",
          "whyItMatters": "A single missed security step (like leaving your database port open to 0.0.0.0/0 or password logins enabled) can lead to data theft, ransomware, or server deletion.",
          "keyConcept": "The 7 Non-Negotiable Launch Rules:\n1. [ ] SSH keys ONLY: `PasswordAuthentication no` in `/etc/ssh/sshd_config`.\n2. [ ] aaPanel port is restricted to your IP (`/32`) in Oracle Cloud Security List.\n3. [ ] PostgreSQL has NO public port published in `docker-compose.prod.yml`.\n4. [ ] `.env` has permission mode `600` and contains unique 48-char random hex passwords.\n5. [ ] `VENDOR_ALLOWED_IPS` is set, or operator password is long and unique.\n6. [ ] Nightly backup cron job runs at 02:30 AM with 30-day retention.\n7. [ ] Turnstile captcha and `REQUIRE_EMAIL_VERIFICATION=true` are active for public registrations.",
          "commands": [
            {
              "cmd": "sudo cat /etc/ssh/sshd_config | grep PasswordAuthentication",
              "explain": "Verifies that password logins are strictly disabled."
            }
          ],
          "exercise": {
            "title": "Conduct a Pre-Launch Security Audit",
            "objective": "Audit all 7 checklist items against your deployment setup.",
            "steps": [
              "1. Review the 7 security checklist items in Section 12 of deploy.md.",
              "2. Verify that PostgreSQL is not published to 0.0.0.0 in docker-compose.prod.yml.",
              "3. Confirm why `.env` must be mode 600.",
              "4. Congratulations on completing the Sama DevOps Mastery Roadmap!"
            ],
            "testCommand": "echo 'Pre-launch security audit completed'",
            "solution": "All 7 checklist items validated:\n- SSH keys only (no password auth)\n- Admin panel locked to /32\n- PostgreSQL internal to Docker network\n- .env mode 600\n- IP whitelisting on admin portal\n- Automated nightly backups with retention\n- Bot protection & email verification enabled",
            "solutionExplanation": "Defense-in-depth across the OS, network, container, and database layers ensures resilient and secure cloud deployments."
          }
        }
      ]
    }
  ]
};
