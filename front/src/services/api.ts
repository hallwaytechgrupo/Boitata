import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3000",
});

export const getFocosCalorByEstadoId = async (estadoId: string) => {
	try {
		const response = await api.get(`focos_calor/estado/${estadoId}`);

		return response.data;
	} catch (error) {
		console.error("Error fetching focosCalor:", error);
		throw error;
	}
};

export const getStateInfo = async (estadoId: string) => {
	try {
		const response = await api.get(`focos_calor/estado/info/${estadoId}`);

		return response.data;
	} catch (error) {
		console.error("Error fetching stateInfo:", error);
		throw error;
	}
};

export const getBiomasShp = async () => {
	try {
		const response = await api.get("biomas");

		return response.data;
	} catch (error) {
		console.error("Error fetching focosCalor:", error);
		throw error;
	}
};
