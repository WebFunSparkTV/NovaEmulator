class Chip8 {
    constructor() {
        this.memory = new Uint8Array(4096);
        this.v = new Uint8Array(16);
        this.i = 0;
        this.pc = 0x200;
        this.gfx = new Uint8Array(64 * 32);
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.stack = [];
        this.keys = new Uint8Array(16);
        this.display = document.getElementById('chip8');
        this.context = this.display.getContext('2d');
        this.loadFontSet();
    }

    loadFontSet() {
        const fontSet = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            // ... remaining font set bytes
        ];
        for (let i = 0; i < fontSet.length; i++) {
            this.memory[i] = fontSet[i];
        }
    }

    loadProgram(program) {
        for (let i = 0; i < program.length; i++) {
            this.memory[0x200 + i] = program[i];
        }
    }

    emulateCycle() {
        let opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
        switch (opcode & 0xF000) {
            case 0x0000:
                switch (opcode & 0x00FF) {
                    case 0x00E0: // CLS
                        this.gfx.fill(0);
                        this.pc += 2;
                        break;
                    case 0x00EE: // RET
                        this.pc = this.stack.pop();
                        this.pc += 2;
                        break;
                }
                break;
            case 0xA000: // LD I, addr
                this.i = opcode & 0x0FFF;
                this.pc += 2;
                break;
            // ... handle other opcodes
        }
    }

    updateTimers() {
        if (this.delayTimer > 0) this.delayTimer--;
        if (this.soundTimer > 0) this.soundTimer--;
    }

    drawGraphics() {
        this.context.clearRect(0, 0, 640, 320);
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 64; x++) {
                if (this.gfx[x + (y * 64)] === 1) {
                    this.context.fillStyle = '#FFF';
                    this.context.fillRect(x * 10, y * 10, 10, 10);
                }
            }
        }
    }
}

let chip8 = new Chip8();
let program = [/* ... CHIP-8 program bytes ... */];
chip8.loadProgram(program);

function loop() {
    chip8.emulateCycle();
    chip8.updateTimers();
    chip8.drawGraphics();
    requestAnimationFrame(loop);
}

loop();
