var opcode;
var memory = [];	  	// 4096 bytes
var V = [];
var I;
var pc;
var stack = [];			// 256 bytes
var sp;
var keys = ['1', '2', '3', '4',
			'q', 'w', 'e', 'r',
			'a', 's', 'd', 'f',
			'z', 'x', 'c', 'v'];

var gfx = [];			// 64w * 32h = 2048 pixels
var delay_timer;
var sound_timer;

var running;
var draw;
var kpress;
var kpressed;

var debug = false;

// Lunar Lander
var rom = [0x12, 0x02, 0x63, 0x30, 0xF3, 0x15, 0xA4, 0x14, 0x61, 0x05, 0x62, 0x00,
	0x25, 0x6C, 0xA4, 0x38, 0x61, 0x08, 0x62, 0x12, 0x25, 0x68, 0xA4, 0x56,
	0x61, 0x00, 0x62, 0x1A, 0x25, 0x42, 0x25, 0x42, 0x17, 0x98, 0x00, 0x00,
	0x00, 0x00, 0xA4, 0xE1, 0x61, 0x00, 0x62, 0x00, 0xD1, 0x21, 0x72, 0x01,
	0x32, 0x1F, 0x12, 0x2C, 0x61, 0x2E, 0x62, 0x00, 0xD1, 0x21, 0x72, 0x01,
	0x32, 0x1F, 0x12, 0x38, 0x15, 0xB6, 0xA4, 0xD1, 0x61, 0x00, 0x62, 0x00,
	0xD1, 0x25, 0xA5, 0x70, 0xFA, 0x33, 0xF2, 0x65, 0x63, 0x31, 0x64, 0x06,
	0x22, 0x58, 0x00, 0xEE, 0xF0, 0x29, 0xD3, 0x45, 0x73, 0x05, 0xF1, 0x29,
	0xD3, 0x45, 0x73, 0x05, 0xF2, 0x29, 0xD3, 0x45, 0x00, 0xEE, 0x00, 0x00,
	0xA4, 0xD6, 0x61, 0x18, 0x62, 0x00, 0xD1, 0x25, 0xA5, 0x73, 0xFB, 0x33,
	0xF2, 0x65, 0x63, 0x31, 0x64, 0x13, 0x22, 0x58, 0x00, 0xEE, 0x00, 0x00,
	0xA4, 0xCC, 0x61, 0x30, 0x62, 0x00, 0xD1, 0x25, 0xA5, 0x76, 0xFC, 0x33,
	0xF2, 0x65, 0x63, 0x31, 0x64, 0x1A, 0x22, 0x58, 0x00, 0xEE, 0x00, 0x00,
	0x6A, 0xFA, 0x6B, 0xFA, 0xA5, 0x70, 0xF2, 0x65, 0x63, 0x31, 0x64, 0x06,
	0x22, 0x58, 0x00, 0xEE, 0xA5, 0x73, 0xF2, 0x65, 0x63, 0x31, 0x64, 0x13,
	0x22, 0x58, 0x00, 0xEE, 0xA5, 0x76, 0xF2, 0x65, 0x63, 0x31, 0x64, 0x1A,
	0x22, 0x58, 0x00, 0xEE, 0x00, 0x00, 0x00, 0x00, 0x66, 0x02, 0xC7, 0x0F,
	0x68, 0x00, 0x77, 0x0B, 0x6E, 0x02, 0x63, 0x02, 0xE3, 0xA1, 0x23, 0xD2,
	0x63, 0x04, 0xE3, 0xA1, 0x25, 0x7C, 0x63, 0x06, 0xE3, 0xA1, 0x23, 0x6E,
	0x12, 0xE6, 0x7C, 0x01, 0x8E, 0xC0, 0x7B, 0xFF, 0x4B, 0x00, 0x16, 0x5E,
	0x4B, 0x1A, 0x23, 0x94, 0x7E, 0xFF, 0x78, 0x01, 0x23, 0xEA, 0x3E, 0x00,
	0x12, 0xEA, 0xC0, 0x01, 0x30, 0x00, 0x13, 0x08, 0x77, 0x01, 0x13, 0x0A,
	0x77, 0xFF, 0x22, 0xA0, 0x22, 0x4A, 0x22, 0xAC, 0x22, 0x74, 0x23, 0xEA,
	0x22, 0xB8, 0x22, 0x8C, 0x12, 0xD0, 0x00, 0x00, 0x63, 0x02, 0xE3, 0xA1,
	0x13, 0xD2, 0x00, 0xEE, 0x63, 0x00, 0x6A, 0x96, 0x6B, 0xFA, 0x6C, 0x04,
	0xA3, 0x46, 0x61, 0x30, 0x62, 0x00, 0x25, 0x2E, 0xA3, 0x55, 0x61, 0x30,
	0x62, 0x0D, 0x25, 0x2E, 0x22, 0x4A, 0x22, 0x74, 0x22, 0x8C, 0x12, 0xC8,
	0x00, 0x00, 0xEA, 0x8A, 0xEA, 0x8A, 0x8E, 0xE8, 0x88, 0xE8, 0x88, 0xEE,
	0x00, 0x00, 0x00, 0x00, 0x00, 0xEE, 0x88, 0xEE, 0x88, 0x8E, 0xEE, 0x84,
	0xE4, 0x84, 0xE4, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7A, 0xFF, 0x3A, 0x00,
	0x13, 0xD6, 0x18, 0x54, 0x00, 0x00, 0xF6, 0x18, 0x77, 0x01, 0x7A, 0xFF,
	0x4A, 0x00, 0x18, 0x54, 0x23, 0xEA, 0x63, 0x06, 0xE3, 0xA1, 0x13, 0x6E,
	0x00, 0xEE, 0x77, 0xFF, 0xC0, 0xF8, 0xFE, 0xFF, 0xE0, 0x80, 0xA3, 0x84,
	0x61, 0x01, 0x62, 0x0C, 0xD1, 0x26, 0x00, 0xEE, 0x25, 0xBE, 0xA4, 0xE2,
	0x61, 0x00, 0x62, 0x01, 0xD1, 0x2F, 0xA4, 0xF1, 0x72, 0x0F, 0xD1, 0x2F,
	0xA5, 0x00, 0x61, 0x26, 0x62, 0x01, 0xD1, 0x2F, 0x72, 0x0F, 0xD1, 0x2F,
	0xA5, 0x1E, 0x61, 0x0D, 0x62, 0x18, 0xD1, 0x27, 0xA5, 0x25, 0x61, 0x1F,
	0x62, 0x18, 0xD1, 0x27, 0xA4, 0xDE, 0x61, 0x00, 0x62, 0x1F, 0xD1, 0x21,
	0x71, 0x08, 0x31, 0x30, 0x13, 0xC6, 0x00, 0xEE, 0x00, 0x00, 0xF6, 0x18,
	0x13, 0x64, 0x3C, 0x00, 0x7C, 0xFF, 0x4B, 0xFA, 0x13, 0xE6, 0x4B, 0x1A,
	0x13, 0xE6, 0x7B, 0x01, 0x78, 0xFF, 0x3E, 0x00, 0x7E, 0xFF, 0xA4, 0xDB,
	0xD7, 0x85, 0x6F, 0x00, 0xA4, 0xE1, 0x89, 0x80, 0x79, 0x05, 0x8D, 0x70,
	0xDD, 0x91, 0x4F, 0x01, 0x16, 0xD4, 0xDD, 0x91, 0x6F, 0x00, 0x7D, 0x07,
	0xDD, 0x91, 0x4F, 0x01, 0x17, 0xF4, 0xDD, 0x91, 0xA4, 0xDB, 0xD7, 0x85,
	0x13, 0x1C, 0x00, 0x00, 0x8A, 0x8A, 0x8A, 0x8A, 0xEE, 0x8B, 0xCA, 0xAB,
	0x9A, 0x8A, 0xBC, 0xB4, 0xBC, 0xA8, 0xAC, 0x47, 0x45, 0x47, 0x45, 0x75,
	0x45, 0x64, 0x54, 0x4C, 0x45, 0xEE, 0xA8, 0xAE, 0xA8, 0xEE, 0xF0, 0xD0,
	0xF0, 0xA0, 0xB0, 0x00, 0x97, 0xA4, 0xC7, 0xA4, 0x97, 0x51, 0x54, 0x71,
	0x25, 0x21, 0xC3, 0x41, 0xD9, 0x01, 0xC1, 0xAB, 0x2B, 0x3B, 0x2A, 0x2A,
	0xD5, 0x55, 0xD5, 0x94, 0xDD, 0xDC, 0x08, 0xC8, 0x48, 0xC8, 0x97, 0xA4,
	0xC7, 0xA4, 0x97, 0x51, 0x55, 0x71, 0x24, 0x20, 0x43, 0x42, 0xEB, 0x42,
	0x43, 0x83, 0x02, 0xBB, 0x80, 0x83, 0xBB, 0x12, 0x93, 0x92, 0x92, 0xBD,
	0x95, 0x9D, 0x95, 0xBD, 0x45, 0x44, 0x44, 0x44, 0x75, 0xEE, 0x28, 0x4E,
	0x88, 0xEE, 0xEF, 0x8D, 0x8F, 0x8A, 0xEB, 0x77, 0x54, 0x77, 0x51, 0x57,
	0x55, 0x55, 0x75, 0x50, 0x55, 0x00, 0xEE, 0x8A, 0x8E, 0x8A, 0xEA, 0xEE,
	0xA4, 0xE4, 0x84, 0x84, 0xEA, 0xAB, 0xEA, 0xAA, 0xAA, 0x20, 0x20, 0xA0,
	0x60, 0x20, 0xEE, 0xA8, 0xEE, 0xA2, 0xAE, 0xEF, 0x4D, 0x4F, 0x4A, 0x4B,
	0x74, 0x56, 0x55, 0x54, 0x74, 0x5D, 0x55, 0x5D, 0xD5, 0x55, 0x5C, 0x48,
	0x48, 0x48, 0xC8, 0x06, 0xEE, 0xA4, 0xE4, 0x84, 0x8E, 0x8E, 0x8A, 0x8A,
	0x8A, 0xEE, 0xE0, 0x40, 0x40, 0x40, 0x40, 0x00, 0xEE, 0x88, 0xEE, 0x82,
	0x8E, 0xE8, 0x88, 0xE8, 0x88, 0x8E, 0xEE, 0x84, 0xE4, 0x84, 0x84, 0x18,
	0x3C, 0xA5, 0xFF, 0xBD, 0x00, 0x80, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40,
	0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x70, 0x70, 0x60, 0x60, 0x60,
	0x60, 0x60, 0x60, 0x70, 0x70, 0x60, 0x40, 0x40, 0x00, 0x00, 0x00, 0x00,
	0x03, 0x01, 0x0F, 0x0F, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x07, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F,
	0x0F, 0x0F, 0x8F, 0x8F, 0x8F, 0x8F, 0x28, 0xF8, 0xFC, 0x7C, 0x78, 0x7C,
	0x7C, 0x10, 0x30, 0x30, 0x78, 0xF8, 0xF0, 0xF8, 0x00, 0x00, 0x63, 0x00,
	0x64, 0x05, 0xD1, 0x25, 0x73, 0x01, 0xF4, 0x1E, 0x71, 0x08, 0x33, 0x03,
	0x15, 0x32, 0x00, 0xEE, 0x00, 0x00, 0x63, 0x00, 0x64, 0x05, 0xD1, 0x25,
	0x73, 0x01, 0xF4, 0x1E, 0x71, 0x08, 0x33, 0x04, 0x15, 0x46, 0x00, 0xEE,
	0x00, 0x00, 0x63, 0x00, 0x64, 0x05, 0xD1, 0x25, 0x73, 0x01, 0xF4, 0x1E,
	0x71, 0x08, 0x33, 0x05, 0x15, 0x5A, 0x00, 0xEE, 0x25, 0x2E, 0x15, 0x2E,
	0x25, 0x2E, 0x15, 0x42, 0x01, 0x04, 0x09, 0x00, 0x04, 0x07, 0x00, 0x02,
	0x01, 0x00, 0xB3, 0xBF, 0xF6, 0x18, 0x77, 0xFF, 0x7A, 0xFF, 0x4A, 0x00,
	0x18, 0x54, 0x23, 0xEA, 0x63, 0x04, 0xE3, 0xA1, 0x15, 0x7C, 0x00, 0xEE,
	0x58, 0x48, 0xA5, 0x9E, 0x61, 0x26, 0x62, 0x14, 0x15, 0x9A, 0xD1, 0x26,
	0x00, 0xEE, 0x03, 0x0F, 0xFF, 0x7F, 0x07, 0x01, 0xFF, 0x00, 0xA5, 0xA4,
	0x61, 0x09, 0x62, 0x0F, 0xD1, 0x21, 0x61, 0x0B, 0x62, 0x10, 0xD1, 0x21,
	0x17, 0x72, 0x25, 0x92, 0x23, 0x8A, 0x25, 0xA6, 0x13, 0x26, 0x25, 0x92,
	0x23, 0x8A, 0x25, 0xA6, 0x00, 0xEE, 0x47, 0x47, 0x80, 0xFF, 0xA8, 0xAB,
	0xA8, 0xAE, 0x88, 0xFF, 0xF0, 0x80, 0xA0, 0x80, 0xA0, 0xA0, 0xF0, 0x00,
	0x22, 0xA0, 0x22, 0x4A, 0x22, 0xAC, 0x22, 0x74, 0x22, 0xB8, 0x22, 0x8C,
	0xA7, 0x6C, 0xD7, 0x86, 0x47, 0x01, 0x16, 0x3A, 0x47, 0x02, 0x16, 0x3A,
	0x47, 0x03, 0x16, 0x3A, 0x47, 0x04, 0x16, 0x3A, 0x47, 0x05, 0x16, 0x3A,
	0x47, 0x06, 0x16, 0x3A, 0x47, 0x24, 0x16, 0x12, 0x47, 0x25, 0x16, 0x12,
	0x47, 0x26, 0x16, 0x12, 0x6D, 0xFF, 0x16, 0x3A, 0x00, 0x00, 0x6E, 0x00,
	0x77, 0x02, 0xA5, 0xC8, 0xD7, 0x81, 0x78, 0xFF, 0x7E, 0x01, 0x3E, 0x0D,
	0x16, 0x18, 0xA5, 0xC9, 0x77, 0xF4, 0x78, 0x01, 0xD7, 0x87, 0x77, 0x08,
	0xA5, 0xD0, 0xD7, 0x87, 0x17, 0xFC, 0xF8, 0x88, 0xA8, 0x88, 0xA8, 0xA8,
	0xF8, 0x00, 0x6E, 0x00, 0x77, 0x02, 0xA5, 0xC8, 0xD7, 0x81, 0x78, 0xFF,
	0x7E, 0x01, 0x3E, 0x0D, 0x16, 0x40, 0xA5, 0xC9, 0x77, 0x01, 0x78, 0x01,
	0xD7, 0x87, 0x77, 0x08, 0xA6, 0x32, 0xD7, 0x87, 0x3D, 0xFF, 0x17, 0xFC,
	0x18, 0x16, 0x6F, 0x00, 0x66, 0x05, 0x86, 0xC5, 0x3F, 0x01, 0x16, 0x80,
	0x15, 0xD8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xBD, 0xFF,
	0xA5, 0x3C, 0x18, 0x38, 0x10, 0x78, 0xD8, 0xD8, 0x78, 0x10, 0x38, 0x00,
	0xA6, 0x77, 0x77, 0x02, 0x78, 0xFD, 0xD7, 0x88, 0x26, 0xA8, 0x16, 0x8C,
	0xA6, 0x77, 0xD7, 0x88, 0xA6, 0x72, 0x77, 0xFE, 0x78, 0x04, 0xD7, 0x85,
	0xA4, 0x7E, 0x61, 0x0C, 0x62, 0x00, 0x25, 0x2E, 0x6D, 0x02, 0xFD, 0x18,
	0x16, 0x98, 0x25, 0xC4, 0x22, 0xA0, 0x22, 0x4A, 0x22, 0xAC, 0x22, 0x74,
	0x22, 0xB8, 0x22, 0x8C, 0x00, 0xEE, 0x41, 0x4A, 0xAE, 0x5D, 0xBB, 0xBD,
	0xBE, 0xB0, 0xB2, 0xB4, 0x4C, 0x40, 0x48, 0x4D, 0x47, 0x41, 0x43, 0x42,
	0xB5, 0x6A, 0x29, 0x2C, 0xE3, 0xC4, 0xDF, 0x2F, 0x1F, 0x2F, 0x88, 0x20,
	0x27, 0x48, 0x6E, 0x02, 0x26, 0xDC, 0x17, 0x40, 0xA4, 0xDB, 0xD7, 0x86,
	0xA6, 0xC8, 0xD7, 0x86, 0x78, 0xFF, 0xFE, 0x18, 0xA4, 0x7E, 0x61, 0x0C,
	0x62, 0x00, 0x25, 0x2E, 0x7D, 0x01, 0x3D, 0x0A, 0x16, 0xDE, 0x6D, 0x00,
	0x00, 0xEE, 0xA6, 0xD2, 0x77, 0x02, 0x78, 0x0D, 0x85, 0x70, 0x86, 0x80,
	0x80, 0x70, 0x89, 0x80, 0xD7, 0x81, 0xD7, 0x81, 0x27, 0x3A, 0x78, 0xFF,
	0x70, 0x01, 0x75, 0xFF, 0x76, 0xFE, 0x79, 0xFE, 0xD7, 0x82, 0xD7, 0x82,
	0xD0, 0x92, 0xD0, 0x92, 0xD5, 0x62, 0xD5, 0x62, 0x7D, 0x01, 0x27, 0x3A,
	0xA4, 0x7E, 0x61, 0x0C, 0x62, 0x00, 0x25, 0x2E, 0xA6, 0xD2, 0x3D, 0x05,
	0x17, 0x0E, 0x17, 0x38, 0x17, 0x56, 0x6E, 0x02, 0xFE, 0x18, 0x00, 0xEE,
	0x78, 0x0A, 0x26, 0xE0, 0x16, 0xFA, 0x17, 0x42, 0x6D, 0x00, 0xF8, 0x18,
	0x26, 0xA8, 0x8A, 0x70, 0x8B, 0x80, 0x7B, 0x05, 0x00, 0xEE, 0xA4, 0x7E,
	0x61, 0x0C, 0x62, 0x00, 0x25, 0x2E, 0xA7, 0x6A, 0x17, 0x62, 0xDA, 0xB2,
	0x6E, 0x02, 0xFE, 0x18, 0x17, 0x56, 0xC0, 0xC0, 0x18, 0x3C, 0xA5, 0xFF,
	0xBD, 0x24, 0x61, 0x1F, 0x62, 0x17, 0xD1, 0x21, 0x00, 0xEE, 0xEE, 0xAA,
	0xAE, 0xA8, 0xE8, 0xEB, 0x4A, 0x4A, 0x4A, 0x4B, 0xA2, 0xB2, 0xAA, 0xA6,
	0xA2, 0x30, 0x90, 0x13, 0x90, 0x38, 0x70, 0x10, 0x76, 0x40, 0x70, 0xE0,
	0x20, 0xE0, 0x20, 0xE0, 0x18, 0x92, 0x61, 0x09, 0x62, 0x08, 0x25, 0x68,
	0xF0, 0x0A, 0x40, 0x01, 0x17, 0xB0, 0x40, 0x02, 0x17, 0xCE, 0x40, 0x03,
	0x17, 0xD8, 0x17, 0xA0, 0x18, 0xA0, 0x60, 0x0B, 0xF0, 0x55, 0x60, 0x96,
	0xA3, 0x27, 0xF0, 0x55, 0xA3, 0x29, 0x60, 0xFA, 0xF0, 0x55, 0xA2, 0xCD,
	0x60, 0x00, 0xF0, 0x55, 0x17, 0xEA, 0x17, 0xEC, 0x00, 0x00, 0xA5, 0xAF,
	0x60, 0x0E, 0xF0, 0x55, 0xA6, 0x61, 0x18, 0xAA, 0x18, 0xB2, 0x60, 0x64,
	0xF0, 0x55, 0xA3, 0x29, 0x60, 0x20, 0xF0, 0x55, 0xA2, 0xCD, 0x60, 0x1A,
	0xF0, 0x55, 0xF3, 0x07, 0x33, 0x00, 0x17, 0xEA, 0x00, 0xE0, 0x12, 0x26,
	0x27, 0x48, 0x7A, 0x07, 0x16, 0xD6, 0xBF, 0xBB, 0x6F, 0x00, 0x60, 0x31,
	0x80, 0xA5, 0x3F, 0x00, 0x18, 0x32, 0x4C, 0x00, 0x18, 0x42, 0x4C, 0x01,
	0x18, 0x42, 0x4C, 0x02, 0x18, 0x42, 0x18, 0x36, 0x00, 0x00, 0x6F, 0x00,
	0x60, 0x4F, 0x80, 0xA5, 0x3F, 0x00, 0x18, 0x32, 0x18, 0x06, 0x00, 0x00,
	0xA4, 0xA2, 0x61, 0x03, 0x62, 0x00, 0x25, 0x56, 0x6E, 0x02, 0xFE, 0x18,
	0x00, 0xEE, 0x28, 0x24, 0x18, 0x32, 0x28, 0x24, 0xA4, 0xBC, 0x61, 0x0B,
	0x62, 0x06, 0x25, 0x2E, 0x18, 0x36, 0x28, 0x24, 0xA4, 0x8E, 0x61, 0x08,
	0x62, 0x06, 0x25, 0x42, 0x18, 0x42, 0x6A, 0xA1, 0xA4, 0xDB, 0xD7, 0x85,
	0xA6, 0x77, 0x77, 0x02, 0x78, 0xFD, 0xD7, 0x88, 0x26, 0xA8, 0xA6, 0x77,
	0xD7, 0x88, 0x77, 0xFE, 0x78, 0x03, 0xA6, 0x72, 0xD7, 0x85, 0xD7, 0x85,
	0xA3, 0x46, 0x61, 0x30, 0x62, 0x00, 0x25, 0x2E, 0x6E, 0x02, 0xFE, 0x18,
	0x7B, 0xFF, 0x7C, 0x01, 0x78, 0x01, 0x4B, 0x1B, 0x23, 0x94, 0x3B, 0x00,
	0x18, 0x66, 0x26, 0xA8, 0x27, 0x48, 0x7A, 0x03, 0x6E, 0x02, 0x26, 0xE0,
	0x17, 0x40, 0xA6, 0x73, 0x61, 0x1B, 0x62, 0x0F, 0xD1, 0x21, 0xA7, 0x7A,
	0x17, 0x9A, 0x00, 0x00, 0xA6, 0x61, 0x60, 0x05, 0xF0, 0x55, 0xA5, 0xAF,
	0x17, 0xB2, 0x60, 0x03, 0xF0, 0x55, 0x60, 0xC8, 0x17, 0xB8, 0xA6, 0x61,
	0x60, 0x03, 0xF0, 0x55, 0xA3, 0x27, 0x17, 0xDA, 0x76, 0xF6, 0x32, 0x7F,
	0x00, 0x10, 0x18, 0x00, 0xFF, 0x7E, 0xC7, 0xFD, 0x80, 0x50, 0x35, 0xC9,
	0xA4, 0x2E, 0x67, 0x80, 0x00, 0x80, 0x10, 0x00, 0x6F, 0xFF, 0x7F, 0x73,
	0x38, 0x00, 0xC9, 0x17, 0xB7, 0x27, 0xA3, 0x3F, 0x00, 0x00, 0x94, 0xC8,
	0xFF, 0xEF, 0xFF, 0xED, 0xC8, 0x90, 0xFE, 0xFC, 0xFF, 0x27, 0x29, 0x30,
	0x90, 0x58, 0x8C, 0x12, 0xFF, 0x7F, 0x7F, 0x77, 0x91, 0x80, 0x1F, 0xE9,
	0x62, 0xD7, 0x3B, 0x2B];

// Maze
// var rom = [	0xA2, 0x1E, 0xC2, 0x01, 0x32, 0x01, 0xA2, 0x1A, 0xD0, 0x14, 0x70, 0x04,
// 			0x30, 0x40, 0x12, 0x00, 0x60, 0x00, 0x71, 0x04, 0x31, 0x20, 0x12, 0x00,
//			0x12, 0x18, 0x80, 0x40, 0x20, 0x10, 0x20, 0x40, 0x80, 0x10];

// key test
// var rom = [	0x12, 0x4E, 0x08, 0x19, 0x01, 0x01, 0x08, 0x01, 0x0F, 0x01, 0x01, 0x09,
// 			0x08, 0x09, 0x0F, 0x09, 0x01, 0x11, 0x08, 0x11, 0x0F, 0x11, 0x01, 0x19,
// 			0x0F, 0x19, 0x16, 0x01, 0x16, 0x09, 0x16, 0x11, 0x16, 0x19, 0xFC, 0xFC,
// 			0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0x00, 0xA2, 0x02, 0x82, 0x0E, 0xF2, 0x1E,
// 			0x82, 0x06, 0xF1, 0x65, 0x00, 0xEE, 0xA2, 0x02, 0x82, 0x0E, 0xF2, 0x1E,
// 			0x82, 0x06, 0xF1, 0x55, 0x00, 0xEE, 0x6F, 0x10, 0xFF, 0x15, 0xFF, 0x07,
// 			0x3F, 0x00, 0x12, 0x46, 0x00, 0xEE, 0x00, 0xE0, 0x62, 0x00, 0x22, 0x2A,
// 			0xF2, 0x29, 0xD0, 0x15, 0x70, 0xFF, 0x71, 0xFF, 0x22, 0x36, 0x72, 0x01,
// 			0x32, 0x10, 0x12, 0x52, 0xF2, 0x0A, 0x22, 0x2A, 0xA2, 0x22, 0xD0, 0x17,
// 			0x22, 0x42, 0xD0, 0x17, 0x12, 0x64];

var font = [0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
			0x20, 0x60, 0x20, 0x20, 0x70, // 1
			0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
			0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
			0x90, 0x90, 0xF0, 0x10, 0x10, // 4
			0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
			0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
			0xF0, 0x10, 0x20, 0x40, 0x40, // 7
			0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
			0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
			0xF0, 0x90, 0xF0, 0x90, 0x90, // A
			0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
			0xF0, 0x80, 0x80, 0x80, 0xF0, // C
			0xE0, 0x90, 0x90, 0x90, 0xE0, // D
			0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
			0xF0, 0x80, 0xF0, 0x80, 0x80];  // F

function init() {
	pc 		= 0x200;
	opcode 	= 0;
	I 		= 0;
	sp 		= 0;

	for (i = 0; i < 2048; i++)
		gfx[i] = 0;

	for (i = 0; i < 256; i++)
		stack[i] = 0;

	for (i = 0; i < 16; i++)
		V[i] = 0;

	for (i = 0; i < 4096; i++)
		memory[i] = 0;
	
	for (i = 0; i < 16; i++)
		keys[i] = 0;
	
	for (i = 0; i < font.length; i++)
    	memory[0x50 + i] = font[i];

	loadGame();
	drawGraphics();
	running = true;
	draw = false;

	window.addEventListener('keydown', keydown, true);
	window.addEventListener('keyup',   keyup,   true);

}

function cycle() {
	opcode = memory[pc] << 8 | memory[pc+1];
	draw = false;
	
	if (debug)
		console.log("$" + Number(pc).toString(16) + " " + Number(opcode).toString(16));
	
	switch (opcode & 0xF000) {
		case 0x0000:
			switch (opcode & 0x00FF) {
				case 0x00E0: // 00E0: Clears the screen.
					for (i = 0; i < 2048; ++i)
						gfx[i] = 0;
					draw = true;
					pc += 2;

					if (debug)
						console.log("  " + "Screen cleared");
				break;

				case 0x00EE: // 00EE: Returns from a subroutine.
					--sp;
					pc = stack[sp];					
					pc += 2;

					if (debug)
						console.log("  " + "Returned to pc = " + Number(pc).toString(16));
				break;
			}

		break;

		case 0x1000: // 1NNN: Jumps to address NNN
			pc = opcode & 0x0FFF;

			if (debug)
			console.log("  " + "pc = " + Number(pc).toString(16));
		break;

		case 0x2000: // 2NNN: Calls subroutine at NNN
			stack[sp] = pc;
			++sp;
			pc = opcode & 0x0FFF;

			if (debug)
				console.log("  " + "Push " + Number(stack[sp-1]).toString(16) + " and call " + Number(pc).toString(16));
		break;

		case 0x3000: // 3XNN: Skips the next instruction if VX equals NN
			if(V[(opcode & 0x0F00) >> 8] == (opcode & 0x00FF)) {
				pc += 4;
				if (debug)
					console.log("  " + "skipped = " + true);
			} else {
				pc += 2;
				if (debug)
					console.log("  " + "skipped = " + false);
			}
		break;

		case 0x4000: // 4XNN: Skips the next instruction if VX doesn't equal NN
			if(V[(opcode & 0x0F00) >> 8] != (opcode & 0x00FF)) {
				pc += 4;
				if (debug)
					console.log("  " + "skipped = " + true);
			} else {
				pc += 2;
				if (debug)
					console.log("  " + "skipped = " + false);
			}
		break;

		case 0x5000: // 5XY0: Skips the next instruction if VX equals VY
			if(V[(opcode & 0x0F00) >> 8] == V[(opcode & 0x00F0) >> 4]) {	
				pc += 4;
				if (debug)
					console.log("  " + "skipped = " + true);
			} else {
				pc += 2;
				if (debug)
					console.log("  " + "skipped = " + false);
			}

		break;

		case 0x6000: // 6XNN: Sets VX to NN
			V[(opcode & 0x0F00) >> 8] = opcode & 0x00FF;
			pc += 2;

			if (debug)
				console.log("  " + "V" + Number((opcode & 0x0F00) >> 8).toString(16) + " = " + Number(V[(opcode & 0x0F00) >> 8]).toString(16));
		break;

		case 0x7000: // 7XNN: Adds NN to VX. (Carry flag is not changed)
			if (debug)
				console.log("  " + "V" + ((opcode & 0x0F00) >> 8) + " = " + V[(opcode & 0x0F00) >> 8] + " + " + (opcode & 0x00FF) + " = ");
			V[(opcode & 0x0F00) >> 8] += opcode & 0x00FF;

			if (V[(opcode & 0x0F00) >> 8] > 255)
				V[(opcode & 0x0F00) >> 8] = (V[(opcode & 0x0F00) >> 8] - 256);

			pc += 2;

			if (debug)
				console.log("  " + V[((opcode & 0x0F00) >> 8)]);
		break;

		case 0x8000:
			switch(opcode & 0x000F) {
				case 0x0000: // 8XY0: Sets VX to the value of VY
					V[(opcode & 0x0F00) >> 8] = V[(opcode &0x00F0) >> 4];
					pc += 2;
				break;

				case 0x0001: // 8XY1: Sets VX to VX or VY
					V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x0F00) >> 8] | V[(opcode &0x00F0) >> 4];
					pc += 2;
				break;

				case 0x0002: // 8XY2: Sets VX to VX and VY
					V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x0F00) >> 8] & V[(opcode &0x00F0) >> 4];
					pc += 2;
				break;
				
				case 0x0003: // 8XY3: Sets VX to VX xor VY
					V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x0F00) >> 8] ^ V[(opcode &0x00F0) >> 4];
					pc += 2;
				break;

				case 0x0004: // 8XY4: Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't
					if(V[(opcode & 0x00F0) >> 4] > (0xFF - V[(opcode & 0x0F00) >> 8])) 
						V[0xF] = 1; //carry
					else 
						V[0xF] = 0;				
	
					V[(opcode & 0x0F00) >> 8] += V[(opcode & 0x00F0) >> 4];
					pc += 2;
				break;

				case 0x0005: // 8XY5: VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
					if (V[(opcode & 0x00F0) >> 4] > V[(opcode & 0x0F00) >> 8]) 
						V[0xF] = 0;
					else 
						V[0xF] = 1;	

					V[(opcode & 0x0F00) >> 8] -= V[(opcode & 0x00F0) >> 4];
					pc += 2;
				break;

				case 0x0006: // 8XZ6: Stores the least significant bit of VX in VF and then shifts VX to the right by 1
					V[0xF] = V[(opcode & 0x0F00) >> 8] & 0x01;
					V[(opcode & 0x0F00) >> 8] >>= 1;
					pc += 2;

					if (debug)
						console.log("  " + "Stored lsb of V" + Number((opcode & 0x0F00) >> 8).toString(16) + " = " + V[(opcode & 0x0F00) >> 8] + " in VF as " + V[0xF]);
				break;

				case 0x0007: // 8XY7: Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't
					if (V[(opcode & 0x0F00) >> 8] > V[(opcode & 0x00F0) >> 4])
						V[0xF] = 0;
					else
						V[0xF] = 1;

					V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x00F0) >> 4] - V[(opcode & 0x0F00) >> 8];				
					pc += 2;
				break;

				case 0x000E: // 8XZE: Stores the most significant bit of VX in VF and then shifts VX to the left by 1.
					V[0xF] = V[(opcode & 0x0F00) >> 8] >> 7;
					V[(opcode & 0x0F00) >> 8] <<= 1;
					pc += 2;

					if (debug)
						console.log("  " + "Stored msb of V" + Number((opcode & 0x0F00) >> 8).toString(16) + " = " + V[(opcode & 0x0F00) >> 8] + " in VF as " + V[0xF]);
				break;
			}

		break;

		case 0x9000: // 9XY0: Skips the next instruction if VX doesn't equal VY
			if(V[(opcode & 0x0F00) >> 8] != V[(opcode & 0x00F0) >> 4]) {	
				pc += 4;
				if (debug)
					console.log("  " + "skipped = " + true);
			} else {
				pc += 2;
				if (debug)
					console.log("  " + "skipped = " + false);
			}

		break;

		case 0xA000: // ANNN: Sets I to the address NNN
			I = opcode & 0x0FFF;
			pc += 2;

			if (debug)
				console.log("  " + "I = " + Number(I).toString(16));
		break;

		case 0xB000: // BNNN: Jumps to the address NNN plus V0
			pc = V[0x0] + (opcode & 0x0FFF);
		break;

		case 0xC000: // CXNN: Sets VX to the result of a bitwise and operation on a random number and NN.
			V[(opcode & 0x0F00) >> 8] = (opcode & 0x00FF) & randomNumber(0, 255);
			pc += 2;
			
			if (debug)
				console.log("  " + "V" + ((opcode & 0x0F00) >> 8) + " = " +  V[(opcode & 0x0F00) >> 8]);
		break;

		case 0xD000: // DXYN: Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N+1 pixels
			var x = V[(opcode & 0x0F00) >> 8];
 			var y = V[(opcode & 0x00F0) >> 4];
			var height = opcode & 0x000F;
			var pixel;
			
			V[0xF] = 0;
			for (h = 0; h < height; h++) {
				pixel = memory[I + h];

				for (w = 0; w < 8; w++) {
					if((pixel & (0x80 >> w)) != 0) {
						if(gfx[(x + w + ((y + h) * 64))] == 1)
							V[0xF] = 1;
						gfx[(x + w + ((y + h) * 64))] ^= 1;
					}
				}
			}

			draw = true;
			pc += 2;

			if (debug)
				console.log("  " + "Draw sprite at (" + x + "," + y + ")" + " with height " + height);
		break;

		case 0xE000:
			switch(opcode & 0x00FF) {
				case 0x009E: // EX9E: Skips the next instruction if the key stored in VX is pressed
					if(key[V[(opcode & 0x0F00) >> 8]] == 1)
						pc += 4;
					else
						pc += 2;
				break;

				case 0x00A1: // EXA1: Skips the next instruction if the key stored in VX isn't pressed
					if(keys[V[(opcode & 0x0F00) >> 8]] == 0)
						pc += 4;
					else
						pc += 2;
				break;
			}

		break;

		case 0xF000:
			switch (opcode & 0x00FF) {
				case 0x0007: // FX07: Sets VX to the value of the delay timer
					V[(opcode & 0x0F00) >> 8] = delay_timer;
					pc += 2;
				break;

				case 0x000A: // FX0A: A key press is awaited, and then stored in VX 
					if (kpress) {
						V[(opcode & 0x0F00) >> 8] = kpressed;
						kpress = false;
						kpressed = 0;
						pc +=2;
					}
				break;

				case 0x0015: // FX15: Sets the delay timer to VX
					delay_timer = V[(opcode & 0x0F00) >> 8];
					pc += 2;
				break;

				case 0x0018: // FX18: Sets the sound timer to VX
					sound_timer = V[(opcode & 0x0F00) >> 8];
					pc += 2;
				break;

				case 0x001E: // FX1E: Adds VX to I
					I += V[(opcode & 0x0F00) >> 8];
					pc += 2;

					if (debug)
					console.log("  " + "Added V" + Number((opcode & 0x0F00) >> 8).toString(16) + " = " + V[(opcode & 0x0F00) >> 8] + " to I: " + Number(I).toString(16));
				break;

				case 0x0029: // FX29: Sets I to the location of the sprite for the character in VX. Characters 0x0-0xF are represented by a 4x5 font
					I = 0x50 + ((V[(opcode & 0x0F00) >> 8]) * 5);
					pc += 2;

					if (debug)
						console.log("  " + "Set sprite addr I to " + Number(I).toString(16));
				break;

				case 0x0033: // FX33: Stores the binary-coded decimal representation of VX
					memory[I]     = (V[(opcode & 0x0F00) >> 8] / 100);
					memory[I + 1] = (V[(opcode & 0x0F00) >> 8] / 10) % 10;
					memory[I + 2] = (V[(opcode & 0x0F00) >> 8] % 100) % 10;
					pc += 2;
				break;

				case 0x0055: // FX55: Stores V0 to VX in memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified
					for (i = 0; i < ((opcode & 0x0F00) >> 8) + 1; ++i)
						memory[I + i] = V[i];

					I += ((opcode & 0x0F00) >> 8) + 1;
					pc += 2;

					if (debug)
						console.log("  " + "Stored V0-V" + Number((opcode & 0x0F00) >> 8).toString(16) + ": " + V + " starting at I = " + Number(I).toString(16));
				break;

				case 0x0065: // FX65: Fills V0 to VX with values from memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified
					for (i = 0; i < ((opcode & 0x0F00) >> 8) + 1; ++i)
						V[i] = memory[I + i];
						
					I += ((opcode & 0x0F00) >> 8) + 1;
					pc += 2;

					if (debug)
						console.log("  " + "Filled V0-V" + Number((opcode & 0x0F00) >> 8).toString(16) + ": " + V + " starting at I = " + Number(I).toString(16));
				break;
			}

		break;
		default:
			console.log("Unimplemented opcode: " + Number(opcode).toString(16));
	}
}

function loadGame() {
	for (i = 0; i < rom.length; i++)
		memory[i+0x200] = rom[i];
}

function drawGraphics() {
	for (y = 0; y < 32; ++y) {
		for (x = 0; x < 64; ++x) {
			drawRectangle(gfx[x+(64*y)], x*8, y*8);
		}
	}
}

function drawRectangle(pixel, x, y) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = (pixel ? "#FFFFFF" : "#000000");
	ctx.fillRect(x, y, 8, 8);
}

function keydown(e) {
	kpress = true;

	switch (e.key) {
		case '1':
    		keys[1] = 1;
			kpressed = 0x1;
		break;

		case '2':
			keys[2] = 1;
			kpressed = 0x2;
		break;

		case '3':
			keys[3] = 1;
			kpressed = 0x3;
		break;

		case '4':
			keys[0xC] = 1;
			kpressed = 0xC;
		break;

		case 'q':
			keys[4] = 1;
			kpressed = 0x4;
		break;

		case 'w':
			keys[5] = 1;
			kpressed = 0x5;
		break;

		case 'e':
			keys[6] = 1;
			kpressed = 0x6;
		break;

		case 'r':
			keys[0xD] = D;
			kpressed = 0x7;
		break;

		case 'a':
			keys[7] = 1;
			kpressed = 0x7;
		break;

		case 's':
			keys[8] = 1;
			kpressed = 0x8;
		break;

		case 'd':
			keys[9] = 1;
			kpressed = 0xA;
		break;

		case 'f':
			keys[0xE] = 1;
			kpressed = 0xE;
		break;

		case 'z':
			keys[0xA] = 1;
			kpressed = 0xA;
		break;

		case 'x':
			keys[0] = 1;
			kpressed = 0x0;
		break;

		case 'c':
			keys[0xB] = 1;
			kpressed = 0xB;
		break;

		case 'v':
			keys[0xF] = 1;
			kpressed = 0xf;
		break;
	}
}

function keyup(e) {
	switch (e.key) {
    case '1':
        keys[1] = 0;
    break;

    case '2':
        keys[2] = 0;
    break;

    case '3':
        keys[3] = 0;
    break;

    case '4':
        keys[0xC] = 0;
    break;

    case 'q':
        keys[4] = 0;
    break;

    case 'w':
        keys[5] = 0;
    break;

    case 'e':
        keys[6] = 0;
    break;

    case 'r':
        keys[0xD] = 0;
    break;

    case 'a':
        keys[7] = 0;
    break;

    case 's':
        keys[8] = 0;
    break;

    case 'd':
        keys[9] = 0;
    break;

    case 'f':
        keys[0xE] = 0;
    break;

    case 'z':
        keys[0xA] = 0;
    break;

    case 'x':
        keys[0] = 0;
    break;

    case 'c':
        keys[0xB] = 0;
    break;

    case 'v':
        keys[0xF] = 0;
    break;
	}
}

function randomNumber(min, max) {  
    return Math.floor(Math.random() * (max - min) + min); 
}

function boop() {
    var snd = new Audio("data:audio/wav;base64,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");
	snd.play();
}

function singleStep() {
	if (running)
		running = false;
	mainLoop();
}

function start() {
	if (!running)
		running = true;
	mainLoop();
}

function pause() {
	running = false;
}

init();

function mainLoop() {
	const cb = document.getElementById('debug');
	debug = cb.checked;

	cycle();

	if (draw) {
		drawGraphics();
	}

	if (delay_timer > 0)
		delay_timer--;

	if (sound_timer > 0)
		if (sound_timer == 1)
			boop();
		sound_timer--;

	if (running)
		requestAnimationFrame(mainLoop);
}

if (debug) {
	console.log("done.");
}
