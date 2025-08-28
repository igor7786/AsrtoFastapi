#!/bin/bash

# Exit on any error
set -e

echo "[+] Setting vm.overcommit_memory=1..."
sudo sysctl -w vm.overcommit_memory=1
if ! grep -q "vm.overcommit_memory" /etc/sysctl.conf; then
  echo "vm.overcommit_memory=1" | sudo tee -a /etc/sysctl.conf
fi

echo "[+] Disabling Transparent Huge Pages (THP)..."
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/defrag

# Add THP setting to grub for persistence
if grep -q "transparent_hugepage=never" /etc/default/grub; then
  echo "[+] GRUB already configured for THP."
else
  echo "[+] Adding transparent_hugepage=never to GRUB config..."
  sudo sed -i 's/GRUB_CMDLINE_LINUX="/GRUB_CMDLINE_LINUX="transparent_hugepage=never /' /etc/default/grub
  sudo update-grub || sudo grub2-mkconfig -o /boot/grub2/grub.cfg
fi

echo "[✓] Redis kernel settings applied successfully."
echo "[!] Reboot recommended for GRUB changes to take effect."
