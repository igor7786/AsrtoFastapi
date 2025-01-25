from app_main.app_imports import logging, colorlog

# Configure the colorlog formatter
handler = colorlog.StreamHandler()
handler.setFormatter(
	colorlog.ColoredFormatter(
		"%(log_color)s%(levelname)s: --> %(message)s",
		log_colors={
			"DEBUG": "cyan",
			"INFO": "green",
			"WARNING": "yellow",
			"ERROR": "red",
			"CRITICAL": "bold_red",
		},
	)
)
logger = logging.getLogger(__name__)
logger.addHandler(handler)
logger.setLevel(logging.INFO)


def app_logger():
	return logger
