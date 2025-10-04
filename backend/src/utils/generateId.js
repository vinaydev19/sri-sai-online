import { Counter } from "../models/counter.model.js";

export const generateServiceId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: 'serviceId' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const id = `SRV-${String(counter.value).padStart(4, '0')}`; // e.g., SRV-0001, SRV-0002, etc.
    return id;
}


export const generateCustomerId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: 'customerId' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    return `CUST-${String(counter.value).padStart(4, '0')}`;
}