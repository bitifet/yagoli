#!/usr/bin/env node

const board = `
   xxx
   xx  x  x
 x      xxx
   xx  x   x
 x  x xx
   xxxx  xxx
 x    x x x xx
    xxxx
    x xx xxx
    xxx x  xxx
     xx xxx x
   xxxx
`;

const encodeCell = ([x,y])=>Number(x)+","+Number(y) // Ensure "x,y" string.
const decodeCell = xy => xy.split(",").map(n=>Number(n))

const past = new Set();

const rules = {//{{{
    alive: {
        "0": false,
        "1": false,
        "2": true,
        "3": true,
        "4": false,
        "5": false,
        "6": false,
        "7": false,
        "8": false,
    },
    dead: {
        "0": false, // MANDATORY
        "1": false,
        "2": false,
        "3": true,
        "4": false,
        "5": false,
        "6": false,
        "7": false,
        "8": false,
    },
};//}}}

function encodeRow(str, y) {//{{{
    const cells = [];
    [...str].map(
        (c,x)=>{c!=" " && cells.push(encodeCell([x, y]));}
    );
    return cells;
};//}}}

function encodeBoard(str) {//{{{
    const rows = str.trim().split("\n");
    return rows.flatMap(encodeRow);
};//}}}

const encodeWorld = w=>[...w].join(":");


// We define the world as a list of alive cells
//   * Listed cells are considered to be alive.
//   * Non listed cells are considered dead.
const world = new Set(
    encodeBoard(board)
);


function getSiblings(xy) {//{{{
    const [x, y] = decodeCell(xy)
    return [
        [x-1, y-1],
        [x, y-1],
        [x+1, y-1],
        [x-1, y],
        [x+1, y],
        [x-1, y+1],
        [x, y+1],
        [x+1, y+1],
    ].map(encodeCell);
};//}}}

function step() {
    const alive = new Set(world); // Copy before any mutation.
    const dead = new Set(); // Storage for resurrection candidates.
    alive.forEach(function(xy) {
        const siblings = getSiblings(xy);
        const aliveSiblings = siblings.filter(s=>alive.has(s));
        const deadSiblings = siblings.filter(s=>!alive.has(s));
        if (! rules.alive[aliveSiblings.length]) world.delete(xy);
        deadSiblings.map(d=>dead.add(d)); // Annotate all as resurrection candidates
    });
    dead.forEach(function(xy) {
        const siblings = getSiblings(xy);
        const aliveSiblings = siblings.filter(s=>alive.has(s));
        if (rules.dead[aliveSiblings.length]) world.add(xy);
    });

};


let c = 0;
for(
    let w = encodeWorld(world);
    ! past.has(w);
    c++, past.add(w), w = encodeWorld(world)
) {
    console.log([...world]);
    step();
};
console.log(`${c} steps`);
console.log("GOTO", [...world]);
