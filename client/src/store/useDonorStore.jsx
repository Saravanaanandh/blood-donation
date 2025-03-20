import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.jsx";

export const useDonorStore = create((set, get) => ({

    isCreatingDonor: false,
    isDonorFetching: false,
    isDonorLoading: false,
    singleDonor: {},
    donors: [],
    requestSent: [],

    createDonor: async (data) => {
        set({ isCreatingDonor: true });
        try {
            const res = await axiosInstance.post('/donate/', data);
            set({ donors: [...get().donors, res.data] });
            toast.success("Thanks, donor!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            set({ isCreatingDonor: false });
        }
    },

    allDonors: async () => {
        set({ isDonorFetching: true });
        try {
            const socket = useAuthStore.getState().socket;

            // Unsubscribe from previous listeners before adding new ones
            ["newRequest", "allRequests", "acceptRequest", "confirmedRequest", "rejectRequest", "completedRequest", "allDonors", "updateProfile","newDonor"]
                .forEach(event => socket.off(event));

            const res = await axiosInstance.get('/donate/');

            socket.on("allDonors", (donorsInfo) => {
                const donorList = donorsInfo.donors.map((donor, index) => ({
                    donor,
                    donorDetail: donorsInfo.donorDetails[index],
                    requestDetail: donorsInfo.requestDetails[index]
                }));

                set({ donors: donorList });
            });

            ["newRequest", "acceptRequest", "confirmedRequest", "rejectRequest", "completedRequest","newDonor"].forEach(event => {
                socket.on(event, async () => {
                    const updatedRes = await axiosInstance.get('/donate/');
                    set({ donors: updatedRes.data });
                });
            });

            socket.on("updateProfile", async (updatedDetail) => {
                const authUser = useAuthStore.getState().authUser;
                if (authUser._id === updatedDetail._id) {
                    set({ authUser: updatedDetail });
                }
                await axiosInstance.get('/donate/');
            });

        } catch (err) {
            console.log(err.response?.data?.message || err);
        } finally {
            set({ isDonorFetching: false });
        }
    },

    getDonor: async (id) => {
        set({ isDonorLoading: true });
        try {
            const socket = useAuthStore.getState().socket;

            // Unsubscribe previous listeners before adding new ones
            ["updateProfile", "getDonor"].forEach(event => socket.off(event));

            const res = await axiosInstance.get(`/donate/${id}`);

            socket.on("getDonor", (data) => {
                set({ singleDonor: data });
            });

            socket.on("updateProfile", async (updatedDetail) => {
                const authUser = useAuthStore.getState().authUser;
                if (authUser._id === updatedDetail._id) {
                    set({ authUser: updatedDetail });
                }
                await axiosInstance.get(`/donate/${id}`);
            });

        } catch (err) {
            console.log(err.response?.data?.message || err);
        } finally {
            set({ isDonorLoading: false });
        }
    },

    UnsubscribeToAlldonors: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("allDonors");
    }
}));
