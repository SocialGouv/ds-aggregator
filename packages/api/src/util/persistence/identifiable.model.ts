export interface IIdentifiable {
  id?: string;
}

export const assertPersistent = (o: IIdentifiable) => {
  if (!o.id) {
    throw new Error("IIdentifiable should be persistent");
  }
};
