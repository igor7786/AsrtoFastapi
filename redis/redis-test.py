import redis

def main():
	r = redis.Redis(host='localhost', port=6379, password='eYVX7EwVmmxKPCDmwMtyKVge8oLd2t82')
	print(r.ping())  # Should print True
if __name__ == '__main__':
	main()