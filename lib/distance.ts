const getDistance = (
	lat1: number | null,
	lon1: number | null,
	lat2: number | null,
	lon2: number | null
): number => {
	if (lat1 && lon1 && lat2 && lon2) {
		// Haversine formula to calculate the distance
		const R = 6371; // Radius of the Earth in km
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return (R * c) / 1.609; // Distance in mi
	} else {
		return 0;
	}
};

export default getDistance;