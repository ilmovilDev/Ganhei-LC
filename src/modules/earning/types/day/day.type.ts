export interface Day {
  id: string;
  date: Date;
  hours: number;
  kilometers: number;

  apps: {
    name: string;
    amount: number;
  }[];

  createdAt: Date;
  updatedAt: Date;
}
