import {firestore} from "@/plugins/firebase";
import {CollectionsNames} from "@/enums/CollectionsNames";
import firebase from "firebase";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;
import {injectable} from 'inversify';
import {Event} from "@/types/Event";

@injectable()
export class EventsService {
    private collection = firestore.collection(CollectionsNames.EVENTS);

    public async getAll(): Promise<Array<Event>> {
        let events: Array<Event> = [];
        let snapshot = await this.collection.get();

        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            let data = doc.data();

           events.push({
               id: doc.id,
               name: data.name,
               details: data.details,
               start: data.start,
               end: data.end,
               color: data.color,
           })
        });

        return events;
    }
}