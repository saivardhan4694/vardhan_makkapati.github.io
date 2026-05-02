import { useMemo } from 'react';
import { useLiquidGlow } from '../hooks/useLiquidGlow';

const WORD_LIST = [
  "def", "class", "import", "from", "return", "yield",
  "if __name__ == '__main__':", "self", "__init__", "pass",
  "try:", "except", "finally:", "raise", "with", "as",
  "async def", "await", "lambda", "*args", "**kwargs",
  "@staticmethod", "@classmethod", "@property", "None", "True", "False",
  "print()", "len()", "range()", "open()", "super()",
  "list", "dict", "set", "tuple", "str", "int", "float",
  "[x for x in data]", "np.array()", "pd.DataFrame()", "torch.tensor()",
  "import numpy as np", "import pandas as pd", "import torch"
];

const COLS = 8;
const ROWS = 10;
const CELL_WIDTH = 100 / COLS;
const CELL_HEIGHT = 100 / ROWS;

export function AmbientBackground() {
  const glowContainerRef = useLiquidGlow();

  const words = useMemo(() => {
    const generatedWords = [];
    
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() > 0.7) continue;

        const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        const top = (r * CELL_HEIGHT) + (CELL_HEIGHT / 2) + ((Math.random() - 0.5) * CELL_HEIGHT * 0.8);
        const left = (c * CELL_WIDTH) + (CELL_WIDTH / 2) + ((Math.random() - 0.5) * CELL_WIDTH * 0.8);
        const fontSize = 10 + Math.random() * 12;

        generatedWords.push({
          id: `word-${r}-${c}`,
          word,
          style: {
            top: `${top}vh`,
            left: `${left}vw`,
            fontSize: `${fontSize}px`
          }
        });
      }
    }
    
    return generatedWords;
  }, []); // Only generated once on initial mount

  return (
    <>
      <div id="ambient-words-base">
        {words.map(({ id, word, style }) => (
          <span key={id} className="ambient-word" style={style}>
            {word}
          </span>
        ))}
      </div>
      <div id="ambient-words-glow" ref={glowContainerRef}>
        {words.map(({ id, word, style }) => (
          <span key={`glow-${id}`} className="ambient-word glow" style={style}>
            {word}
          </span>
        ))}
      </div>
    </>
  );
}
