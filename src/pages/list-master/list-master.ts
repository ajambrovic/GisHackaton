
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';
import { PositionUpdateProvider } from './../../providers/position-update/position-update';

declare var ol: any;

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, private geolocation: Geolocation, private positionUpdate: PositionUpdateProvider) {
    this.currentItems = this.items.query();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    // Declare a Tile layer with an OSM source
    var osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
    var croatiaProjection = new ol.proj.Projection({
      code: 'EPSG:3765',
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [-100000, 4580000, 1300000, 5300000],
      units: 'm'
    });
    ol.proj.addProjection(croatiaProjection);

    // Create a View, set it center and zoom level
    var view = new ol.View({
      center: ol.proj.fromLonLat([15.981919000000001, 45.815010799999996]),
      zoom: 6
    });
    // Instanciate a Map, set the object target to the map DOM id
    var map = new ol.Map({
      target: 'map'
    });
    // Add the created layer to the Map
    map.addLayer(osmLayer);
    // Set the view for the map
    map.setView(view);
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.positionUpdate.updatePosition(data);
    });

  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
