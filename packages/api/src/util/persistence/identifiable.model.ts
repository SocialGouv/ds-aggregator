export interface IIdentifiable {
  id?: string | number;
}

export const assertPersistent = (o: IIdentifiable) => {
  if (!o.id) {
    throw new Error("IIdentifiable should be persistent");
  }
};
