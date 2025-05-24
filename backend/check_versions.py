import requests
import re
from packaging import version
from typing import Dict, List, Tuple, Optional
from pathlib import Path

def get_latest_version(package_name: str) -> str:
    try:
        response = requests.get(f"https://pypi.org/pypi/{package_name}/json", timeout=5)
        if response.status_code == 200:
            return response.json()["info"]["version"]
    except Exception as e:
        print(f"Error checking {package_name}: {e}")
    return "Not Found"

def parse_requirement_line(line: str) -> Optional[Tuple[str, str, str]]:
    """Parse a requirement line into (package, version, comment)."""
    line = line.strip()
    if not line or line.startswith('#'):
        return None
    
    # Extract package and version
    if '==' in line:
        pkg, ver_comment = line.split('==', 1)
        pkg = pkg.strip()
        ver_comment = ver_comment.strip()
        # Split version and comment
        if '#' in ver_comment:
            ver, comment = ver_comment.split('#', 1)
            ver = ver.strip()
            comment = '#' + comment
        else:
            ver = ver_comment
            comment = ''
        return pkg, ver, comment
    return None

def update_requirements_file(file_path: str, dry_run: bool = False) -> Dict[str, Tuple[str, str, str, str]]:
    """Check and optionally update requirements file with latest versions."""
    print(f"\nChecking {file_path}...")
    print("-" * 80)
    print(f"{'Package':<25} {'Current':<15} {'Latest':<15} {'Status'}")
    print("-" * 80)
    
    updates = {}
    new_lines = []
    
    with open(file_path, 'r') as f:
        for line in f:
            parsed = parse_requirement_line(line)
            if not parsed:
                new_lines.append(line)
                continue
                
            pkg, ver, comment = parsed
            latest = get_latest_version(pkg)
            
            if latest == "Not Found":
                print(f"{pkg:<25} {ver:<15} {'Not Found':<15} SKIPPED")
                new_lines.append(line)
                continue
                
            try:
                if version.parse(ver) < version.parse(latest):
                    status = f"OUTDATED (New: {latest})"
                    updates[pkg] = (ver, latest, status, comment)
                    new_line = f"{pkg}=={latest}{' ' + comment if comment else ''}\n"
                    new_lines.append(new_line)
                else:
                    status = "UP TO DATE"
                    updates[pkg] = (ver, latest, status, comment)
                    new_lines.append(line)
            except version.InvalidVersion:
                status = "INVALID VERSION FORMAT"
                updates[pkg] = (ver, latest, status, comment)
                new_lines.append(line)
            
            print(f"{pkg:<25} {ver:<15} {latest:<15} {status}")
    
    # Write updates if not in dry run mode
    if not dry_run and any(updates.values()):
        with open(file_path, 'w') as f:
            f.writelines(new_lines)
    
    return updates

def main():
    import sys
    dry_run = '--dry-run' in sys.argv
    
    if dry_run:
        print("Running in dry-run mode. No files will be modified.")
    
    print("Checking package versions...")
    
    # Update main requirements
    updates = update_requirements_file("requirements.txt", dry_run=dry_run)
    
    # Update test requirements
    test_updates = update_requirements_file("requirements-test.txt", dry_run=dry_run)
    updates.update(test_updates)
    
    # Print summary
    outdated = [pkg for pkg, (_, _, status, _) in updates.items() 
               if status.startswith('OUTDATED')]
    
    print("\n" + "="*80)
    print(f"Summary:")
    print(f"- {len(outdated)} packages can be updated")
    print(f"- {len(updates) - len(outdated)} packages are up to date")
    
    if outdated:
        print("\nPackages that can be updated:")
        for pkg in sorted(outdated):
            old_ver, new_ver, status, _ = updates[pkg]
            print(f"- {pkg}: {old_ver} → {new_ver}")
    
    if dry_run:
        print("\nRun without --dry-run to update the requirements files.")
    elif outdated:
        print("\nRequirements files have been updated with the latest versions.")

if __name__ == "__main__":
    main()
