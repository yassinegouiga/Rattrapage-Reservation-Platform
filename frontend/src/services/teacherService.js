import api from './api';

export const teacherService = {
  getAvailableRooms: async (date, heureDebut, heureFin) => {
    const response = await api.get('/rooms/available', {
      params: { date, heureDebut, heureFin }
    });
    return response.data;
  },

  getMyReservations: async (teacherId) => {
    const response = await api.get(`/reservations/enseignant/${teacherId}`);
    return response.data;
  },

  createReservation: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  cancelReservation: async (reservationId) => {
    const response = await api.delete(`/reservations/${reservationId}`);
    return response.data;
  }
};
