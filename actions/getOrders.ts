import prisma from '@/libs/prismadb';

export default async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        products: {
          some: {
            inStock: true, // Adjust the condition as needed
          },
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createDate: 'desc',
      },
    });
    return orders;
  } catch (error: any) {
    console.error('Prisma Error:', error);
    throw new Error(error as string);
  }
}
