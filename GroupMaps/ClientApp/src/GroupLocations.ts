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

/* 
    The grid represents a matrix, the size of each square is determined by the groupByDistance. 
    The grid square each locations coordinate (lat,lng) is in is calculated by the formula:
        
        floor(x - min(x) / square-size) , floor(y - min(y) / square-size)
        
    Locations are grouped according to those which are in directly adjacent squares of the grid matrix
 */
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
                Math.floor((location.norm_lng - minLng) / groupByDistance)].toString();
        grid[coord] ? grid[coord].push(location) : grid[coord] = [location];
    });
    return grid;
}


/*
 For each populated tile in the grid the recursive function 'group' will attempt to visit each 
 adjacent grid square and look for match in the populated tiles 
 */
const groupAdjecentGridTiles = (grid: Grid): (Set<string> | null)[] => {
    let tileCoords: Set<string> = new Set(Object.keys(grid));
    let visitedCoords: Set<string> = new Set();
    const directions = [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]

    const group = (currentSquare: string, currentCoordGroup: Set<string> = new Set()): Set<string> => {
        if (!tileCoords.has(currentSquare) || visitedCoords.has(currentSquare))
            return null
        visitedCoords.add(currentSquare)
        currentCoordGroup.add(currentSquare)
        // TODO small optimisation here to skip negative coordinates 
        for (let dir of directions) {
            const newDirection =
                String(parseInt(currentSquare[0]) + dir[0]) + ',' + String(parseInt(currentSquare[2]) + dir[1])
            group(newDirection, currentCoordGroup);
        }
        return currentCoordGroup;
    }

    return Array.from(tileCoords)
        .map(tile => {
            if (!visitedCoords.has(tile))
                return group(tile);
        })
        .filter(x => x !== undefined)

}

export default groupLocations