type Location = {
    id: number,
    lat: number,
    lng: number,
    norm_lng: number,
    norm_lat: number,
    postcode: string
}

type Grid = {
    [key:string] : Location

}


const groupLocations = (locations: Location[], groupByDistance: number): Location[][] => {
    throw new DOMException;
}

const getLocationPlaceInGrid = (locaitons: Location[], groupByDistance: number): Grid => {
    throw new DOMException;
} 

const groupAdjecentGridTiles = (grid: Grid): (Set<string> | null)[] => {
    let tiles: Set<string> = new Set(Object.keys(grid));
    let visited: Set<string> = new Set();
    const directions: [number, number][] = [[0, 1], [1, 0], [-1, 0], [0, -1]]
    const group = (currentSquare: string, groupSet: Set<string> = new Set()):  Set<string> | null => {
            if (!tiles.has(currentSquare) || visited.has(currentSquare))
                return null
            visited.add(currentSquare)
            groupSet.add(currentSquare)
            for (let dir of directions) {
                const newDirection =
                    String(parseInt(currentSquare[0]) + dir[0]) + ',' + String(parseInt(currentSquare[2]) + dir[1])
                group(newDirection, groupSet);
            }
            return groupSet;
    }
    let adjacentGroups = [];
    for (let tile in tiles)
        adjacentGroups.push(group(tile));
    return adjacentGroups.filter(x => x != null);

}

export default groupLocations