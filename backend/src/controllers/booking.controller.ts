import { Request, Response } from 'express';
import prisma from '../db/db';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const { carId, startDate, endDate, totalPrice, status } = req.body;

    const booking = await prisma.booking.create({
      data: {
        userId,
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        status: status || 'pending',
      },
    });

    res.status(201).json(booking);
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const bookings = await prisma.booking.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: {
          select: { name: true, email: true },
        },
        car: {
          select: { name: true, price: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(bookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        car: {
          select: { name: true, price: true },
        },
      },
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, ...rest } = req.body;
    const data: any = { ...rest };
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data,
    });
    res.status(200).json(booking);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: error.message });
  }
};
