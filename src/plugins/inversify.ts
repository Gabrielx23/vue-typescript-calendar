import 'reflect-metadata';
import {Container} from 'inversify';
import {EventsService} from "@/services/EventsService";

const container = new Container();

container.bind<EventsService>('EventsService').to(EventsService)

export default container;