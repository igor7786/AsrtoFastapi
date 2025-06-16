#!/bin/bash

# Wi-Fi details
WIFI_IFACE="wlp2s0"   # Change if your Wi-Fi interface is different
SSID="iggr"
PASSWORD="traktor123"

# Wi-Fi static IP config
WIFI_IP="192.168.102.100"
WIFI_NETMASK="255.255.255.0"
WIFI_GATEWAY="192.168.102.1"
DNS1="8.8.8.8"
DNS2="1.1.1.1"

# NAT bridge config for VMs
BRIDGE_NAME="vmbr0"
BRIDGE_IP="192.168.100.1"
BRIDGE_NETMASK="255.255.255.0"
BRIDGE_SUBNET="192.168.100.0/24"

echo "==> Unblocking Wi-Fi with rfkill"
rfkill unblock all

echo "==> Creating wpa_supplicant.conf"
wpa_passphrase "$SSID" "$PASSWORD" > /etc/wpa_supplicant/wpa_supplicant.conf

echo "Adding extra lines to wpa_supplicant.conf"
cat << EOF >> /etc/wpa_supplicant/wpa_supplicant.conf
ctrl_interface=/run/wpa_supplicant
country=UK
EOF

echo "==> Backing up original /etc/network/interfaces"
cp /etc/network/interfaces /etc/network/interfaces.bak.$(date +%F-%T)

echo "==> Writing new /etc/network/interfaces"
cat << EOF > /etc/network/interfaces
auto lo
iface lo inet loopback

auto $WIFI_IFACE
iface $WIFI_IFACE inet static
    address $WIFI_IP
    netmask $WIFI_NETMASK
    gateway $WIFI_GATEWAY
    dns-nameservers $DNS1 $DNS2
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

auto $BRIDGE_NAME
iface $BRIDGE_NAME inet static
    address $BRIDGE_IP
    netmask $BRIDGE_NETMASK
    bridge_ports none
    bridge_stp off
    bridge_fd 0
    post-up echo 1 > /proc/sys/net/ipv4/ip_forward
    post-up iptables -t nat -A POSTROUTING -s $BRIDGE_SUBNET -o $WIFI_IFACE -j MASQUERADE
    post-down iptables -t nat -D POSTROUTING -s $BRIDGE_SUBNET -o $WIFI_IFACE -j MASQUERADE
EOF

echo "==> Enabling IP forwarding"
echo 1 > /proc/sys/net/ipv4/ip_forward

echo "==> Making IP forwarding permanent"
if ! grep -q '^net.ipv4.ip_forward=1' /etc/sysctl.conf; then
    echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
fi
sysctl -p

echo "==> Restarting networking service"
systemctl restart networking

echo "==> Enabling and starting wpa_supplicant for $WIFI_IFACE"
systemctl enable wpa_supplicant@"$WIFI_IFACE".service
systemctl start wpa_supplicant@"$WIFI_IFACE".service

echo "==> Final networking restart"
systemctl restart networking

echo "==> Setup complete. Current IP addresses:"
ip a show "$WIFI_IFACE"

echo "==> Testing internet connectivity (ping google.com):"
ping -c 4 google.com || echo "Ping failed! Check your network setup."

echo "If no IP on $WIFI_IFACE, you can manually run: sudo dhclient $WIFI_IFACE"
