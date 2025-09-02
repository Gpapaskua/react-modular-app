export interface IParameter {
  id: string;
  name: string;
  value: number;
  units: string;
}

export interface IGroup {
  id: string;
  name: string;
  description: string;
  parameters: IParameter[];
}
