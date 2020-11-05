<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
            flat
        >
          <v-dialog
              v-model="dialog"
              width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="red lighten-2"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  class="mr-2"
              >
                Add event
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="headline grey lighten-2">
                Add new event
              </v-card-title>

              <v-form v-model="valid">
                <v-container>
                  <v-row>
                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          v-model="newElement.name"
                          label="Event name"
                          required
                      ></v-text-field>
                      <v-textarea
                          v-model="newElement.details"
                          label="Details"
                      ></v-textarea>
                      <v-text-field
                          type="date"
                          v-model="newElement.start"
                          label="Event date"
                          required
                      ></v-text-field>
                      <v-text-field
                          type="date"
                          v-model="newElement.end"
                          label="Event end date"
                      ></v-text-field>
                      <v-text-field
                          v-model="newElement.color"
                          type="color"
                          label="Event color"
                          required
                      ></v-text-field>
                      <v-text-field
                          v-model="newElement.color"
                      ></v-text-field>
                      <v-btn text color="primary" @click="addEvent">Save</v-btn>
                      <v-btn text color="secondary" @click="dialog = false">Cancel</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-dialog>
          <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
              bottom
              right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
        ></v-calendar>
        <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
        >
          <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
          >
            <v-toolbar
                :color="selectedEvent.color"
                dark
            >
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon @click="editingElement = selectedEvent">mdi-pencil</v-icon>
            </v-toolbar>
            <v-card-text>
              <span v-if="editingElement === null || editingElement.id !== selectedEvent.id"
                    v-html="selectedEvent.details"></span>
              <v-form v-else v-model="valid">
                <v-container>
                  <v-row>
                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          v-model="editingElement.name"
                          label="Event name"
                          required
                      ></v-text-field>
                      <v-textarea
                          v-model="editingElement.details"
                          label="Details"
                      ></v-textarea>
                      <v-text-field
                          type="date"
                          v-model="editingElement.start"
                          label="Event date"
                          required
                      ></v-text-field>
                      <v-text-field
                          type="date"
                          v-model="editingElement.end"
                          label="Event end date"
                      ></v-text-field>
                      <v-text-field
                          v-model="editingElement.color"
                          type="color"
                          label="Event color"
                          required
                      ></v-text-field>
                      <v-text-field
                          v-model="editingElement.color"
                      ></v-text-field>
                      <v-btn text color="primary" @click="updateEvent">Save</v-btn>
                      <v-btn text color="secondary" @click="editingElement = null">Cancel</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {$inject} from '@vanroeybe/vue-inversify-plugin/dist/decorator';
import {Component, Vue} from 'vue-property-decorator';
// eslint-disable-next-line no-unused-vars
import {EventsService} from "@/services/EventsService";

@Component
export default class Calendar extends Vue {
  @$inject('EventsService') private readonly eventsService!: EventsService

  private valid: boolean = false;
  private focus: string = '';
  private type: string = 'month';
  private dialog: boolean = false;
  private newElement: Event = {};
  private editingElement: Event | null = null;
  private selectedEvent: Event = {};
  private selectedElement: Event | null = null;
  private selectedOpen: boolean = false;
  private events: Array<Event> = [];
  private typeToLabel: object = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    '4day': '4 Days',
  };

  private viewDay({date}): void {
    this.focus = date;
    this.type = 'day';
  }

  private async deleteEvent(id: string): void {
    await this.eventsService.delete(id);
    await this.updateRange();
    this.selectedOpen = null;
  }

  private async updateEvent(): void {
    await this.eventsService.update(this.editingElement);
    this.editingElement = null;
    await this.updateRange();
  }

  private async addEvent(): void {
    await this.eventsService.add(this.newElement);
    this.newElement = {};
    this.dialog = false;
    await this.updateRange();
  }

  public getEventColor(event): string {
    return event.color;
  }

  public setToday(): void {
    this.focus = '';
  }

  public prev(): void {
    this.$refs.calendar.prev();
  }

  public next(): void {
    this.$refs.calendar.next();
  }

  public showEvent({nativeEvent, event}): void {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;

      setTimeout(() => {
        this.selectedOpen = true
      }, 10)
    }

    if (this.selectedOpen) {
      this.selectedOpen = false
      setTimeout(open, 10)
    } else {
      open()
    }

    nativeEvent.stopPropagation()
  }

  async updateRange(): void {
    this.events = await this.eventsService.getAll();
  }
}
</script>

<style scoped lang="scss">
</style>
