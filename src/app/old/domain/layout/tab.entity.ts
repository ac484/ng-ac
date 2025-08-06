import { BaseEntity } from "../common/base.entity";
import { ActivatedRouteSnapshot } from "@angular/router";

export interface TabProps {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
  isClosable: boolean;
  isActive: boolean;
  icon?: string;
}

export class Tab extends BaseEntity<string> {
  constructor(props: TabProps, id?: string) {
    super(props, id);
  }

  get title(): string {
    return this.props.title;
  }

  get path(): string {
    return this.props.path;
  }

  get snapshotArray(): ActivatedRouteSnapshot[] {
    return this.props.snapshotArray;
  }

  get isClosable(): boolean {
    return this.props.isClosable;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get icon(): string | undefined {
    return this.props.icon;
  }

  public setActive(active: boolean): void {
    this.props.isActive = active;
  }

  public setTitle(title: string): void {
    this.props.title = title;
  }

  public setPath(path: string): void {
    this.props.path = path;
  }

  public addSnapshot(snapshot: ActivatedRouteSnapshot): void {
    this.props.snapshotArray.push(snapshot);
  }

  public clearSnapshots(): void {
    this.props.snapshotArray = [];
  }

  public setClosable(closable: boolean): void {
    this.props.isClosable = closable;
  }

  public setIcon(icon: string): void {
    this.props.icon = icon;
  }
} 