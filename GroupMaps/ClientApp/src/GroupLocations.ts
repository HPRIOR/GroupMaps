type Location = {
    id: number,
    lat: number,
    lng: number,
    norm_lng: number,
    norm_lat: number,
    postcode: string
}

type Grid = {
    [key: string]: Location
}

const groupLocations = (locations: Location[], groupByDistance: number): Location[][] => {
    const grid = getLocationPlaceInGrid(locations, groupByDistance);
    const adjacentGridCoords = groupAdjecentGridTiles(grid);
    let adjacentLocations = [];
    adjacentGridCoords.forEach(coordGroup => {
        let group = [];
        coordGroup.forEach(gridCoord => {
            group = group.concat(grid[gridCoord]);
        });
        adjacentLocations.push(group);
    });
    return adjacentLocations;
}

const getLocationPlaceInGrid = (locations: Location[], groupByDistance: number): Grid => {
    let grid = {};
    const minLat = Math.min(...locations.map(x => x.norm_lat));
    const minLng = Math.min(...locations.map(x => x.norm_lng));
    locations.forEach(location => {
        const coord =
            [Math.floor((location.norm_lat - minLat) / groupByDistance),
            Math.floor((location.norm_lng - minLng / groupByDistance))].toString();
        grid[coord] ? grid[coord].push(location) : grid[coord] = [location];
    });
    console.log(grid)
    return grid;
}

const groupAdjecentGridTiles = (grid: Grid): (Set<string> | null)[] => {
    let tileCoords: Set<string> = new Set(Object.keys(grid));
    let visitedCoords: Set<string> = new Set();
    const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]]
    const group = (currentSquare: string, currentCoordGroup: Set<string> = new Set()): Set<string> | null => {
        if (!tileCoords.has(currentSquare) || visitedCoords.has(currentSquare))
            return null
        visitedCoords.add(currentSquare)
        currentCoordGroup.add(currentSquare)
        for (let dir of directions) {
            const newDirection =
                String(parseInt(currentSquare[0]) + dir[0]) + ',' + String(parseInt(currentSquare[2]) + dir[1])
            group(newDirection, currentCoordGroup);
        }
        return currentCoordGroup;
    }
    let adjacentGroups = [];
    for (let tile of tileCoords) {
        adjacentGroups.push(group(tile));
    }
    return adjacentGroups.filter(x => x != null);
}
export default groupLocations