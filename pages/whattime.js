// what time is it right now in any city (there'll be a dropdown)
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function WhatTime() {
  const [city, setCity] = useState('New York')
  const [time, setTime] = useState('')

  let cities = [
    {
      "city": "Qal eh-ye Now",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Chaghcharan",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Lashkar Gah",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Zaranj",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Tarin Kowt",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Zareh Sharan",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Asadabad",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Taloqan",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Mahmud-E Eraqi",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Mehtar Lam",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Baraki Barak",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Aybak",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Mayda Shahr",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Karokh",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Sheberghan",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Pol-e Khomri",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Balkh",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Meymaneh",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Andkhvoy",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Qalat",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Ghazni",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Feyzabad",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Kondoz",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Jalalabad",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Charikar",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Gardiz",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Bamian",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Baghlan",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Farah",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Herat",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Mazar-e Sharif",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Kandahar",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Kabul",
      "timezone": "Asia/Kabul"
    },
    {
      "city": "Mariehamn",
      "timezone": "Europe/Mariehamn"
    },
    {
      "city": "Kruje",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Fier",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Lushnje",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Puke",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Bajram Curri",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Kukes",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Sarande",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Erseke",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Pogradec",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Korce",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Berat",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Corovode",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Gramsh",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Librazhd",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Tepelene",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Permet",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Gjirokaster",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Peshkopi",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Burrel",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Lezhe",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Rreshen",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Vlore",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Elbasan",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Durres",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Shkoder",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Tirana",
      "timezone": "Europe/Tirane"
    },
    {
      "city": "Jijel",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Tizi-Ouzou",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Bordj Bou Arreridj",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "M'sila",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Guelma",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Oum el Bouaghi",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Timimoun",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Sidi bel Abbes",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Tlimcen",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Beni Ounif",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Abadla",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Sefra",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Skikda",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Djanet",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "I-n-Amenas",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "In Amguel",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "El Bayadh",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "El Oued",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Hassi Messaoud",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Chlef",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Mascara",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Mostaganem",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Saida",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Tiarat",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Bejaia",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Blida",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Bouira",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Medea",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Souk Ahras",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Tebessa",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Adrar",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Reggane",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Bechar",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Tindouf",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Illizi",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Arak",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "I-n-Salah",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "El Golea",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Laghouat",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Touggourt",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Ouargla",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Biskra",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Djelfa",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Setif",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Batna",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Annaba",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Constantine",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Oran",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Tamanrasset",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Ghardaia",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Algiers",
      "timezone": "Africa/Algiers"
    },
    {
      "city": "Pago Pago",
      "timezone": "Pacific/Pago_Pago"
    },
    {
      "city": "Andorra",
      "timezone": "Europe/Andorra"
    },
    {
      "city": "Mucusso",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Lucapa",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Capenda-Camulemba",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Saurimo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Muconda",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Cacolo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Caxito",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Camabatela",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Ndalatando",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Quibala",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Calulo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Waku Kungo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Songo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Mbanza-Congo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Nzeto",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Soyo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Cabinda",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Calucinga",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Camacupa",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Cubal",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Mavinga",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Cuito Caunavale",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Luiana",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Ondjiva",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Chitado",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Chibemba",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Chibia",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Quipungo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Luau",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Cangamba",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Lumbala Nguimbo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Cazombo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Dundo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Ambriz",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Dondo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Sumbe",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Uige",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Kuito",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Lobito",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Xangongo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Luena",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Tômbua",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Malanje",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Benguela",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Lubango",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Namibe",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Menongue",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Huambo",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Luanda",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Artigas Base",
      "timezone": null
    },
    {
      "city": "Capitan Arturo Prat Station",
      "timezone": null
    },
    {
      "city": "Marambio Station",
      "timezone": null
    },
    {
      "city": "Zucchelli Station",
      "timezone": null
    },
    {
      "city": "Rothera Station",
      "timezone": null
    },
    {
      "city": "Palmer Station",
      "timezone": null
    },
    {
      "city": "Base Presidente Montalva",
      "timezone": null
    },
    {
      "city": "Carlini Station",
      "timezone": null
    },
    {
      "city": "King Sejong Station",
      "timezone": null
    },
    {
      "city": "Great Wall Station",
      "timezone": null
    },
    {
      "city": "Escudero Base",
      "timezone": null
    },
    {
      "city": "Elephant Island",
      "timezone": null
    },
    {
      "city": "Scott Base",
      "timezone": null
    },
    {
      "city": "McMurdo Station",
      "timezone": null
    },
    {
      "city": "Zhongshan Station",
      "timezone": null
    },
    {
      "city": "Vostok",
      "timezone": null
    },
    {
      "city": "Peter I Island",
      "timezone": null
    },
    {
      "city": "Mirny Station",
      "timezone": null
    },
    {
      "city": "Mawson Station",
      "timezone": null
    },
    {
      "city": "Davis Station",
      "timezone": null
    },
    {
      "city": "Concordia Research Station",
      "timezone": null
    },
    {
      "city": "Casey Station",
      "timezone": null
    },
    {
      "city": "Amundsen–Scott South Pole Station",
      "timezone": null
    },
    {
      "city": "Wasa Station",
      "timezone": null
    },
    {
      "city": "Troll Station",
      "timezone": null
    },
    {
      "city": "Svea Station",
      "timezone": null
    },
    {
      "city": "Novolazarevskaya Station",
      "timezone": null
    },
    {
      "city": "Neumayer Station III",
      "timezone": null
    },
    {
      "city": "Maitri Station",
      "timezone": null
    },
    {
      "city": "Halley Station",
      "timezone": null
    },
    {
      "city": "Belgrano Station",
      "timezone": null
    },
    {
      "city": "Camp Sobral",
      "timezone": null
    },
    {
      "city": "Aboa Station",
      "timezone": null
    },
    {
      "city": "San Martín Station",
      "timezone": null
    },
    {
      "city": "Gen. O'Higgins Station",
      "timezone": null
    },
    {
      "city": "Esperanza Station",
      "timezone": null
    },
    {
      "city": "Orcadas Station",
      "timezone": null
    },
    {
      "city": "Signy Research Station",
      "timezone": null
    },
    {
      "city": "Dumont d'Urville Station",
      "timezone": null
    },
    {
      "city": "Showa Station",
      "timezone": null
    },
    {
      "city": "Saint John's",
      "timezone": "America/Antigua"
    },
    {
      "city": "28 de Noviembre",
      "timezone": "America/Santiago"
    },
    {
      "city": "Gobernador Gregores",
      "timezone": "America/Argentina/Rio_Gallegos"
    },
    {
      "city": "Comondante Luis Piedrabuena",
      "timezone": "America/Argentina/Rio_Gallegos"
    },
    {
      "city": "Paso Rio Mayo",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Alto Rio Sanguer",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "El Maiten",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Puerto Madryn",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Trelew",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Las Heras",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "San Martin",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "Uspallata",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "Cutral Co",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Punta Alta",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "San Nicolas",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Campana",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Chacabuco",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Mercedes",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Lincoln",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Chivilcoy",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Veinticinco de Mayo",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Nueve de Julio",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Dolores",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Pedro Luro",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Tres Arroyos",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Coronel Suarez",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Balcarce",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "25 de Mayo",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "General Roca",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Comallo",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Ingeniero Jacobacci",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "General Conesa",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Choele Choel",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "San Francisco",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Alta Gracia",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Villa Maria",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Bell Ville",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Villa Rumipal",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Villa Carlos Paz",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Chumbicha",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Tinogasta",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Abra Pampa",
      "timezone": "America/Argentina/Jujuy"
    },
    {
      "city": "Humahuaca",
      "timezone": "America/Argentina/Jujuy"
    },
    {
      "city": "Susques",
      "timezone": "America/Argentina/Jujuy"
    },
    {
      "city": "Chepes",
      "timezone": "America/Argentina/La_Rioja"
    },
    {
      "city": "Yacuiba",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Tartagal",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Joaquin V. Gonzalez",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "General Guemes",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Trancas",
      "timezone": "America/Argentina/Tucuman"
    },
    {
      "city": "Presidencia Roque Saenz Pena",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Pampa del Infierno",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Villa Angela",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Ingeniero Guillermo N. Juarez",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Comandante Fontana",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Doctor Pedro P. Pena",
      "timezone": "America/Asuncion"
    },
    {
      "city": "San Lorenzo",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Corrientes",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Concepcion del Uruguay",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Victoria",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Gualeguay",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Parana",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Villa Constitucion",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Rafaela",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Eldorado",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Rodeo",
      "timezone": "America/Argentina/San_Juan"
    },
    {
      "city": "Las Plumas",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Gastre",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Telsen",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Malargue",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "Tunuyan",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "La Paz",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "Chos Malal",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Las Lajas",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Zarate",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Carhue",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Darregueira",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Juarez",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Mar de Ajo",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Lobos",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Chascomus",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Junin",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "La Plata",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Pergamino",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Lujan",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Azul",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Villalonga",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Victorica",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "General Pico",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "San Antonio Oeste",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Sierra Colorado",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Mercedes",
      "timezone": "America/Argentina/San_Luis"
    },
    {
      "city": "Rio Tercero",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Belen",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Rinconada",
      "timezone": "America/Argentina/Jujuy"
    },
    {
      "city": "San Pedro",
      "timezone": "America/Argentina/Jujuy"
    },
    {
      "city": "Libertador General San Martin",
      "timezone": "America/Argentina/Jujuy"
    },
    {
      "city": "Chilecito",
      "timezone": null
    },
    {
      "city": "Chamical",
      "timezone": "America/Argentina/La_Rioja"
    },
    {
      "city": "Los Blancos",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Cafayate",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Cerrillos",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "San Antonio de los Cobres",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Anatuya",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Frias",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Monte Quemado",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Juan Jose Castelli",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Charata",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Las Lomitas",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Mercedes",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Concordia",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Sunchales",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "San Justo",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Vera",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Reconquista",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Venado Tuerto",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Esquel",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Zapala",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Olavarria",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Tandil",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Viedma",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "San Luis",
      "timezone": "America/Argentina/San_Luis"
    },
    {
      "city": "Rio Cuarto",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "San Salvador de Jujuy",
      "timezone": "America/Argentina/Jujuy"
    },
    {
      "city": "San Ramon de la Nueva Oran",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Goya",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Puerto San Julian",
      "timezone": "America/Argentina/Rio_Gallegos"
    },
    {
      "city": "Perito Moreno",
      "timezone": "America/Argentina/Rio_Gallegos"
    },
    {
      "city": "Rio Grande",
      "timezone": "America/Argentina/Ushuaia"
    },
    {
      "city": "Ushuaia",
      "timezone": "America/Argentina/Ushuaia"
    },
    {
      "city": "Sarmiento",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "San Rafael",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "Necochea",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Rio Colorado",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Catamarca",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "La Rioja",
      "timezone": "America/Argentina/La_Rioja"
    },
    {
      "city": "Santiago del Estero",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Resistencia",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Gualeguaychu",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "El Calafate",
      "timezone": "America/Argentina/Rio_Gallegos"
    },
    {
      "city": "San Juan",
      "timezone": "America/Argentina/San_Juan"
    },
    {
      "city": "Rawson",
      "timezone": "America/Argentina/Catamarca"
    },
    {
      "city": "Neuquen",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Santa Rosa",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "San Carlos de Bariloche",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Salta",
      "timezone": "America/Argentina/Salta"
    },
    {
      "city": "Tucumán",
      "timezone": "America/Argentina/Tucuman"
    },
    {
      "city": "Formosa",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Santa Fe",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Rosario",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Puerto Deseado",
      "timezone": "America/Argentina/Rio_Gallegos"
    },
    {
      "city": "Rio Gallegos",
      "timezone": "America/Argentina/Rio_Gallegos"
    },
    {
      "city": "Comodoro Rivadavia",
      "timezone": null
    },
    {
      "city": "Mendoza",
      "timezone": "America/Argentina/Mendoza"
    },
    {
      "city": "Bahia Blanca",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Mar del Plata",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Córdoba",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Posadas",
      "timezone": "America/Argentina/Cordoba"
    },
    {
      "city": "Buenos Aires",
      "timezone": "America/Argentina/Buenos_Aires"
    },
    {
      "city": "Ashtarak",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Ijevan",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Artashat",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Gavarr",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Yeghegnadzor",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Gyumri",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Vanadzor",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Yerevan",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Oranjestad",
      "timezone": "America/Aruba"
    },
    {
      "city": "Central Coast",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Sunshine Coast",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Bourke",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Pine Creek",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Adelaide River",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "McMinns Lagoon",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Newcastle Waters",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Ravensthorpe",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Wagin",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Roebourne",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Pannawonica",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Tom Price",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Kalbarri",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Mount Magnet",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Morawa",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Port Denison",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Merredin",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Mount Barker",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Katanning",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Narrogin",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Gingin",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Bunbury",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Kwinana",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Southern Cross",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Kaltukatjara",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Queanbeyan",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Tweed Heads",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Ivanhoe",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Wilcannia",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Merimbula",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Echuca",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Deniliquin",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Nowra",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Ulladulla",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Batemans Bay",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Cooma",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Tumut",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Leeton",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Young",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Cowra",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Forbes",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Goulburn",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Kiama",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Katoomba",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Richmond",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Lithgow",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Parkes",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Bathurst",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Maitland",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Singleton",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Mudgee",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Muswellbrook",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Taree",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Kempsey",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Gunnedah",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Coffs Harbour",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Narrabri",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Inverell",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Yamba",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Ballina",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Wagga Wagga",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Scone",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Byron Bay",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Berri",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Peterborough",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Wallaroo",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Clare",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Meningie",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Kingston South East",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Bordertown",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Penola",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Kingoonya",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Kimba",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Streaky Bay",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Cowell",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Tumby Bay",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Andamooka",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Woomera",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Port Pirie",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Gawler",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Murray Bridge",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Victor Harbor",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Hamilton",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Ouyen",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Colac",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Stawell",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Horsham",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Ararat",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Maryborough",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Bairnsdale",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Sale",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Traralgon",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Wonthaggi",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Cranbourne",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Ballarat",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Melton",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Seymour",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Shepparton",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Cobram",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Swan Hill",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Sunbury",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Proserpine",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Theodore",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Eidsvold",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Barcaldine",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Winton",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Longreach",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Caboolture",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Warwick",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Kingaroy",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Dalby",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Bongaree",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Gympie",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Ingham",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Birdsville",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Bedourie",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Boulia",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Richmond",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Burketown",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Hervey Bay",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Biloela",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Yeppoon",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Emerald",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Moranbah",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Charters Towers",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Ayr",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Atherton",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Port Douglas",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Smithton",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Scottsdale",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Bicheno",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Oatlands",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Queenstown",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Kingston",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Tennant Creek",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Yulara",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Erldunda",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Norseman",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Halls Creek",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Kununurra",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Derby",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Onslow",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Exmouth",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Carnarvon",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Newman",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Meekatharra",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Three Springs",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Manjimup",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Northam",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Esperance",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Leonara",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Laverton",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Wyndham",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Albury",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Forster-Tuncurry",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Port Macquarie",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Tamworth",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Grafton",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Moree",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Goondiwindi",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Lismore",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Wollongong",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Ceduna",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Mount Gambier",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Port Augusta",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Warrnambool",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Mildura",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Geelong",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Camooweal",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Quilpie",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Charleville",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Hughenden",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Caloundra",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Roma",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Toowoomba",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Georgetown",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Thargomindah",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Weipa",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Karumba",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Cloncurry",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Maryborough",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Bundaberg",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Gladstone",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Bowen",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Innisfail",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Mackay",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Burnie",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Launceston",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Katherine",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Busselton",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Mandurah",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Broome",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Kalgoorlie",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Albany",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Port Hedland",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Karratha",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Geraldton",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Griffith",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Orange",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Dubbo",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Armidale",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Broken Hill",
      "timezone": "Australia/Broken_Hill"
    },
    {
      "city": "Port Lincoln",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Whyalla",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Portland",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Bendigo",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Wangaratta",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Windorah",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Mount Isa",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Rockhampton",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Cairns",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Gold Coast",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Devonport",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Darwin",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Alice Springs",
      "timezone": "Australia/Darwin"
    },
    {
      "city": "Canberra",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Newcastle",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Adelaide",
      "timezone": "Australia/Adelaide"
    },
    {
      "city": "Townsville",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Brisbane",
      "timezone": "Australia/Brisbane"
    },
    {
      "city": "Hobart",
      "timezone": "Australia/Hobart"
    },
    {
      "city": "Perth",
      "timezone": "Australia/Perth"
    },
    {
      "city": "Melbourne",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Sydney",
      "timezone": "Australia/Sydney"
    },
    {
      "city": "Bregenz",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Eisenstadt",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Wiener Neustadt",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Graz",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Klagenfurt",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Linz",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Passau",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Salzburg",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Innsbruck",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Vienna",
      "timezone": "Europe/Vienna"
    },
    {
      "city": "Gadabay",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Goranboy",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Tovuz",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Agdam",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Qabala",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Oguz",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Ganca",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Yevlax",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Sumqayt",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Ali Bayramli",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Goycay",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Lankaran",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Saki",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Stepanakert",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Kapan",
      "timezone": "Asia/Yerevan"
    },
    {
      "city": "Naxcivan",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Baku",
      "timezone": "Asia/Baku"
    },
    {
      "city": "Manama",
      "timezone": "Asia/Bahrain"
    },
    {
      "city": "Tangail",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Sylhet",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Mymensingh",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Jamalpur",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Narayanganj",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Jessore",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Barisal",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Comilla",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Pabna",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Nawabganj",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Saidpur",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Rangpur",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Khulna",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Rajshahi",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Dhaka",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Chittagong",
      "timezone": "Asia/Dhaka"
    },
    {
      "city": "Bridgetown",
      "timezone": "America/Barbados"
    },
    {
      "city": "Baranavichy",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Polatsk",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Maladzyechna",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Pinsk",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Mazyr",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Mahilyow",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Babruysk",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Orsha",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Lida",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Hrodna",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Barysaw",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Homyel",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Vitsyebsk",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Brest",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Minsk",
      "timezone": "Europe/Minsk"
    },
    {
      "city": "Mons",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Hasselt",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Arlon",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Gent",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Liege",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Brugge",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Namur",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Charleroi",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Antwerpen",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "Brussels",
      "timezone": "Europe/Brussels"
    },
    {
      "city": "El Cayo",
      "timezone": "America/Belize"
    },
    {
      "city": "Corozal",
      "timezone": "America/Belize"
    },
    {
      "city": "Dangriga",
      "timezone": "America/Belize"
    },
    {
      "city": "Belize City",
      "timezone": "America/Belize"
    },
    {
      "city": "Orange Walk",
      "timezone": "America/Belize"
    },
    {
      "city": "Punta Gorda",
      "timezone": "America/Belize"
    },
    {
      "city": "Belmopan",
      "timezone": "America/Belize"
    },
    {
      "city": "Lokossa",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Kandi",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Ouidah",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Abomey",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Natitingou",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Djougou",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Parakou",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Porto-Novo",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Cotonou",
      "timezone": "Africa/Porto-Novo"
    },
    {
      "city": "Hamilton",
      "timezone": "Atlantic/Bermuda"
    },
    {
      "city": "Paro",
      "timezone": "Asia/Thimphu"
    },
    {
      "city": "Punakha",
      "timezone": "Asia/Thimphu"
    },
    {
      "city": "Wangdue Prodrang",
      "timezone": "Asia/Thimphu"
    },
    {
      "city": "Thimphu",
      "timezone": "Asia/Thimphu"
    },
    {
      "city": "Punata",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Cliza",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Quillacollo",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Puerto Villarroel",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Tarabuco",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Guayaramerin",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Santa Ana",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Baures",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Sica Sica",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Rurrenabaque",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Sorata",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Achacachi",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Viacha",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Quime",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Llallagua",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Uncia",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Uyuni",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Villa Martin",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Betanzos",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Portachuelo",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Samaipata",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Cuevo",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San Carlos",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San Lorenzo",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Entre Rios",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Aiquile",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Padilla",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Camargo",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Reyes",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San Borja",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Magdalena",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San Ramon",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Puerto Heath",
      "timezone": "America/Lima"
    },
    {
      "city": "Charana",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Puerto Acosta",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Apolo",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Coroico",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Coro Coro",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Sabaya",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Challapata",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Llica",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Potosi",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Villazon",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Tupiza",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Montero",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Piso Firme",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Robore",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Puerto Quijarro",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San Ignacio",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Ascension",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San Javier",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San Rafael",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Vallegrande",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Puerto Suarez",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Charagua",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Villamontes",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Bermejo",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Cochabamba",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Oruro",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Camiri",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Cobija",
      "timezone": "America/Rio_Branco"
    },
    {
      "city": "San Matias",
      "timezone": "America/La_Paz"
    },
    {
      "city": "San José",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Trinidad",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Tarija",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Sucre",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Riberalta",
      "timezone": "America/La_Paz"
    },
    {
      "city": "La Paz",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Santa Cruz",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Zenica",
      "timezone": "Europe/Sarajevo"
    },
    {
      "city": "Mostar",
      "timezone": "Europe/Sarajevo"
    },
    {
      "city": "Tuzla",
      "timezone": "Europe/Sarajevo"
    },
    {
      "city": "Prijedor",
      "timezone": "Europe/Sarajevo"
    },
    {
      "city": "Banja Luka",
      "timezone": "Europe/Sarajevo"
    },
    {
      "city": "Sarajevo",
      "timezone": "Europe/Sarajevo"
    },
    {
      "city": "Mochudi",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Ghanzi",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Lokhwabe",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Lehututu",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Tshabong",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Tsau",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Nokaneng",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Mohembo",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Maun",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Kasane",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Nata",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Mopipi",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Palapye",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Lobatse",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Kanye",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Molepolole",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Francistown",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Mahalapye",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Serowe",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Gaborone",
      "timezone": "Africa/Gaborone"
    },
    {
      "city": "Grajau",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Presidente Dutra",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Itapecuru Mirim",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Sao Jose de Ribamar",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Santa Ines",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Rosario",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Timon",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Capanema",
      "timezone": "America/Belem"
    },
    {
      "city": "Portel",
      "timezone": "America/Belem"
    },
    {
      "city": "Itupiranga",
      "timezone": "America/Belem"
    },
    {
      "city": "Pimenta Bueno",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Ponta Pora",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Maracaju",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Jardim",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Tres Lagoas",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Guanhaes",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Leopoldina",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Nova Lima",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Pouso Alegre",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itauna",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Caratinga",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Diamantina",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Nanuque",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Barbacena",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Pocos de Caldas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Guaxupe",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Joao del Rei",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Muriae",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Passos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Conselheiro Lafaiete",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Formiga",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Frutal",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Iturama",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ituiutaba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Araguari",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Almenara",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Varzea Grande",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Cáceres",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Santana do Livramento",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Canoas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Quarai",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Santa Vitoria do Palmar",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Lourenco do Sul",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Canela",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Gabriel",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Rosario do Sul",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Cachoeira do Sul",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Osorio",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Santa Cruz do Sul",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Luiz Gonzaga",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Santo Angelo",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Carazinho",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Erechim",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Guaira",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Palmas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Arapongas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Paranagua",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Jose dos Pinhais",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Guarapuava",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Rio Negro",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Apucarana",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Lapa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Irati",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Castro",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Telemaco Borba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Jacarezinho",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Concordia",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Blumenau",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Brusque",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ararangua",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Jaragua do Sul",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Tubarao",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Laguna",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Joacaba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Cacador",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Canoinhas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Camocim",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Russas",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Sobral",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Iguatu",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Quixada",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Caninde",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Campo Maior",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Barras",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Rio Largo",
      "timezone": "America/Maceio"
    },
    {
      "city": "Palmeira dos Indios",
      "timezone": "America/Maceio"
    },
    {
      "city": "Santa Cruz Cabralia",
      "timezone": "America/Bahia"
    },
    {
      "city": "Paulo Afonso",
      "timezone": "America/Bahia"
    },
    {
      "city": "Brumado",
      "timezone": "America/Bahia"
    },
    {
      "city": "Jaguaquara",
      "timezone": "America/Bahia"
    },
    {
      "city": "Itapetinga",
      "timezone": "America/Bahia"
    },
    {
      "city": "Ubaitaba",
      "timezone": "America/Bahia"
    },
    {
      "city": "Cachoeiro de Itapemirim",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Barra Mansa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Nova Iguacu",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Duque de Caxias",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Niteroi",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Cabo Frio",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Macae",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Miracema",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Apodi",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Santa Cruz",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Morrinhos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ceres",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Catalao",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Cristalina",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Trindade",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ipora",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Inhumas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itaberai",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Santo Andre",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Pindamonhangaba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Rio Claro",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ourinhos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itanhaem",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Jaboticabal",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Braganca Paulista",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Jundiai",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Jose dos Campos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Guaratingueta",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Pirassununga",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Americana",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Piracicaba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Joao da Boa Vista",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Carlos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Tupa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Penapolis",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Presidente Prudente",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Registro",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Tatui",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Avare",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Garca",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Catanduva",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Batatais",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Barretos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Marilia",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itu",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itapetininga",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Jaboatao",
      "timezone": "America/Recife"
    },
    {
      "city": "Olinda",
      "timezone": "America/Recife"
    },
    {
      "city": "Cabo de Santo Agostinho",
      "timezone": "America/Recife"
    },
    {
      "city": "Carpina",
      "timezone": "America/Recife"
    },
    {
      "city": "Arcoverde",
      "timezone": "America/Recife"
    },
    {
      "city": "Manacapuru",
      "timezone": "America/Manaus"
    },
    {
      "city": "Maues",
      "timezone": "America/Manaus"
    },
    {
      "city": "Pedreiras",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Codo",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Coroata",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Chapadinha",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Pinheiro",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Barra do Corda",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Viana",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Colinas",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Viseu",
      "timezone": "America/Belem"
    },
    {
      "city": "Capitao Poco",
      "timezone": "America/Belem"
    },
    {
      "city": "Castanhal",
      "timezone": "America/Belem"
    },
    {
      "city": "Salinopolis",
      "timezone": "America/Belem"
    },
    {
      "city": "Alenquer",
      "timezone": "America/Santarem"
    },
    {
      "city": "Oriximina",
      "timezone": "America/Santarem"
    },
    {
      "city": "Xinguara",
      "timezone": "America/Belem"
    },
    {
      "city": "Jacundá",
      "timezone": "America/Belem"
    },
    {
      "city": "Uruara",
      "timezone": "America/Santarem"
    },
    {
      "city": "Altamira",
      "timezone": "America/Santarem"
    },
    {
      "city": "Paragominas",
      "timezone": "America/Belem"
    },
    {
      "city": "Cameta",
      "timezone": "America/Belem"
    },
    {
      "city": "Rolim de Moura",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Ariquemes",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Abuna",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Tocantinopolis",
      "timezone": "America/Araguaina"
    },
    {
      "city": "Gurupi",
      "timezone": "America/Araguaina"
    },
    {
      "city": "Aquidauana",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Paranaiba",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Sete Lagoas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Divinopolis",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ipatinga",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Araxa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Lavras",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Uba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Campo Belo",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ponte Nova",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Curvelo",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Paracatu",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Bocaiuva",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Aracuai",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Janauba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Juina",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Barra do Garcas",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Pontes e Lacerda",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Barra do Bugres",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Rondonopolis",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Uruguaiana",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Borja",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Novo Hamburgo",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Rio Grande",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Camaqua",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Bento Goncalves",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Vacaria",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ijui",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Santa Rosa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Maringa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Cascavel",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Campo Murao",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Foz do Iguacu",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Francisco do Sul",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Porto Uniao",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itajai",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Imbituba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Lajes",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Granja",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Crato",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Itapipoca",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Paracuru",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Acarau",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Taua",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Crateus",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Baturite",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Ipu",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Floriano",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Piripiri",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Penedo",
      "timezone": "America/Maceio"
    },
    {
      "city": "Itabuna",
      "timezone": "America/Bahia"
    },
    {
      "city": "Itamaraju",
      "timezone": "America/Bahia"
    },
    {
      "city": "Guanambi",
      "timezone": "America/Bahia"
    },
    {
      "city": "Porto Seguro",
      "timezone": "America/Bahia"
    },
    {
      "city": "Valenca",
      "timezone": "America/Bahia"
    },
    {
      "city": "Serrinha",
      "timezone": "America/Bahia"
    },
    {
      "city": "Tucano",
      "timezone": "America/Bahia"
    },
    {
      "city": "Senhor do Bonfim",
      "timezone": "America/Bahia"
    },
    {
      "city": "Remanso",
      "timezone": "America/Bahia"
    },
    {
      "city": "Itambe",
      "timezone": "America/Bahia"
    },
    {
      "city": "Bom Jesus da Lapa",
      "timezone": "America/Bahia"
    },
    {
      "city": "Itaberaba",
      "timezone": "America/Bahia"
    },
    {
      "city": "Sao Mateus",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Patos",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Volta Redonda",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Petropolis",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Nova Cruz",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Caico",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Acu",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Estancia",
      "timezone": "America/Maceio"
    },
    {
      "city": "Caracarai",
      "timezone": "America/Boa_Vista"
    },
    {
      "city": "Porto Santana",
      "timezone": "America/Belem"
    },
    {
      "city": "Rio Verde",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Pires do Rio",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Anapolis",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Goianesia",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Niquelandia",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itumbiara",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Jatai",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Mineiros",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Formosa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Jose do Rio Preto",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Limeira",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Taubate",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Jau",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Assis",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Itapeva",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Botucatu",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Novo Horizonte",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Andradina",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Fernandopolis",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Barreiros",
      "timezone": "America/Recife"
    },
    {
      "city": "Salgueiro",
      "timezone": "America/Recife"
    },
    {
      "city": "Goiana",
      "timezone": "America/Recife"
    },
    {
      "city": "Timbauba",
      "timezone": "America/Recife"
    },
    {
      "city": "Bacabal",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Braganca",
      "timezone": "America/Belem"
    },
    {
      "city": "Obidos",
      "timezone": "America/Santarem"
    },
    {
      "city": "Guajara-Miram",
      "timezone": "America/La_Paz"
    },
    {
      "city": "Porto Nacional",
      "timezone": "America/Araguaina"
    },
    {
      "city": "Dourados",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Governador Valadares",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Pirapora",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Juiz de Fora",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Santa Maria",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Passo Fundo",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Xapeco",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Joinville",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Juazeiro do Norte",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Nova Vicosa",
      "timezone": "America/Bahia"
    },
    {
      "city": "Alagoinhas",
      "timezone": "America/Bahia"
    },
    {
      "city": "Juazeiro",
      "timezone": "America/Bahia"
    },
    {
      "city": "Vitória",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Joao Pessoa",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Campina Grande",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Nova Friburgo",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Aracatuba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sena Madureira",
      "timezone": "America/Rio_Branco"
    },
    {
      "city": "Fonte Boa",
      "timezone": "America/Manaus"
    },
    {
      "city": "Eirunepe",
      "timezone": "America/Eirunepe"
    },
    {
      "city": "Manicore",
      "timezone": "America/Manaus"
    },
    {
      "city": "Barcelos",
      "timezone": "America/Manaus"
    },
    {
      "city": "Tonantins",
      "timezone": "America/Manaus"
    },
    {
      "city": "Tefe",
      "timezone": "America/Manaus"
    },
    {
      "city": "Coari",
      "timezone": "America/Manaus"
    },
    {
      "city": "Sao Cabriel da Cachoeira",
      "timezone": "America/Manaus"
    },
    {
      "city": "Novo Airao",
      "timezone": "America/Manaus"
    },
    {
      "city": "Itacoatiara",
      "timezone": "America/Manaus"
    },
    {
      "city": "Parintins",
      "timezone": "America/Manaus"
    },
    {
      "city": "Natal",
      "timezone": "America/Manaus"
    },
    {
      "city": "Crato",
      "timezone": "America/Manaus"
    },
    {
      "city": "Imperatriz",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Balsas",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Breves",
      "timezone": "America/Belem"
    },
    {
      "city": "Jacareacanga",
      "timezone": "America/Santarem"
    },
    {
      "city": "Tucurui",
      "timezone": "America/Belem"
    },
    {
      "city": "Itaituba",
      "timezone": "America/Santarem"
    },
    {
      "city": "Conceicao do Araguaia",
      "timezone": "America/Belem"
    },
    {
      "city": "Abaetetuba",
      "timezone": "America/Belem"
    },
    {
      "city": "Principe da Beira",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Araguaina",
      "timezone": "America/Araguaina"
    },
    {
      "city": "Palmas",
      "timezone": "America/Araguaina"
    },
    {
      "city": "Teofilo Otoni",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Uberaba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Januaria",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Mato Grosso",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Aripuana",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Sinop",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Jaguarao",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Bage",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Londrina",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Criciuma",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Aracati",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Ico",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Parnaiba",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Picos",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Arapiraca",
      "timezone": "America/Maceio"
    },
    {
      "city": "Jequie",
      "timezone": "America/Bahia"
    },
    {
      "city": "Ilheus",
      "timezone": "America/Bahia"
    },
    {
      "city": "Canavieiras",
      "timezone": "America/Bahia"
    },
    {
      "city": "Santa Maria da Vitoria",
      "timezone": "America/Bahia"
    },
    {
      "city": "Irece",
      "timezone": "America/Bahia"
    },
    {
      "city": "Xique-Xique",
      "timezone": "America/Bahia"
    },
    {
      "city": "Linhares",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Campos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Mossoro",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Aracaju",
      "timezone": "America/Maceio"
    },
    {
      "city": "Laranjal do Jari",
      "timezone": "America/Santarem"
    },
    {
      "city": "Amapa",
      "timezone": "America/Belem"
    },
    {
      "city": "Vila Velha",
      "timezone": "America/Belem"
    },
    {
      "city": "Santos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Bauru",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Iguape",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Franca",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Garanhuns",
      "timezone": "America/Recife"
    },
    {
      "city": "Caruaru",
      "timezone": "America/Recife"
    },
    {
      "city": "Rio Branco",
      "timezone": "America/Rio_Branco"
    },
    {
      "city": "São Luís",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Porto Velho",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Alvorada",
      "timezone": "America/Araguaina"
    },
    {
      "city": "Corumba",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Belo Horizonte",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Montes Claros",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Uberlandia",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Colider",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Alta Floresta",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Cuiaba",
      "timezone": "America/Cuiaba"
    },
    {
      "city": "Pelotas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Caxias do Sul",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ponta Grossa",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Teresina",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Maceio",
      "timezone": "America/Maceio"
    },
    {
      "city": "Vitoria da Conquista",
      "timezone": "America/Bahia"
    },
    {
      "city": "Barreiras",
      "timezone": "America/Bahia"
    },
    {
      "city": "Vila Velha",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Natal",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Campinas",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sorocaba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Ribeirao Preto",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Petrolina",
      "timezone": "America/Recife"
    },
    {
      "city": "Cruzeiro do Sul",
      "timezone": "America/Rio_Branco"
    },
    {
      "city": "Manaus",
      "timezone": "America/Manaus"
    },
    {
      "city": "Caxias",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Santarem",
      "timezone": "America/Santarem"
    },
    {
      "city": "Maraba",
      "timezone": "America/Belem"
    },
    {
      "city": "Vilhena",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Ji-Parana",
      "timezone": "America/Porto_Velho"
    },
    {
      "city": "Campo Grande",
      "timezone": "America/Campo_Grande"
    },
    {
      "city": "Florianopolis",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Feira de Santana",
      "timezone": "America/Bahia"
    },
    {
      "city": "Boa Vista",
      "timezone": "America/Boa_Vista"
    },
    {
      "city": "Macapá",
      "timezone": "America/Belem"
    },
    {
      "city": "Belem",
      "timezone": "America/Belem"
    },
    {
      "city": "Brasilia",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Porto Alegre",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Curitiba",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Fortaleza",
      "timezone": "America/Fortaleza"
    },
    {
      "city": "Salvador",
      "timezone": "America/Bahia"
    },
    {
      "city": "Goiania",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Recife",
      "timezone": "America/Recife"
    },
    {
      "city": "Rio de Janeiro",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Sao Paulo",
      "timezone": "America/Sao_Paulo"
    },
    {
      "city": "Bandar Seri Begawan",
      "timezone": "Asia/Brunei"
    },
    {
      "city": "Lovec",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Montana",
      "state_ansi": "MT",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Razgrad",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Sliven",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Plovdiv",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Pernik",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Vratsa",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Shumen",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Khaskovo",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Stara Zagora",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Pleven",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Turnovo",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Kyustendil",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Dobrich",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Varna",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Ruse",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Burgas",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Sofia",
      "timezone": "Europe/Sofia"
    },
    {
      "city": "Fada Ngourma",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Orodara",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Solenzo",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Nouna",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Dedougou",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Gorom Gorom",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Djibo",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Tougan",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Kombissiri",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Ziniare",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Yako",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Reo",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Leo",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Sapouy",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Boulsa",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Zorgo",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Koupela",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Po",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Manga",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Diebougou",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Gaoua",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Bogande",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Dori",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Sebba",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Diapaga",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Koudougou",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Ouahigouya",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Kaya",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Tenkodogo",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Banfora",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Bobo Dioulasso",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Ouagadougou",
      "timezone": "Africa/Ouagadougou"
    },
    {
      "city": "Cankuzo",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Karusi",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Rutana",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Ruyigi",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Bubanza",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Kayanza",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Makamba",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Ngozi",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Kirundo",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Muramvya",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Bururi",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Muyinga",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Gitega",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Bujumbura",
      "timezone": "Africa/Bujumbura"
    },
    {
      "city": "Kampong Spoe",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Kampong Thum",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Prey Veng",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Phnum Tbeng Meanchey",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Stoeng Treng",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Kracheh",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Senmonorom",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Lumphat",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Svay Rieng",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Sisophon",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Krong Koh Kong",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Pursat",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Kampong Cham",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Kompong Chhnang",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Kampot",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Takeo",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Battambang",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Siem Reap",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Phnom Penh",
      "timezone": "Asia/Phnom_Penh"
    },
    {
      "city": "Buea",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Bafang",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Foumban",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Bafoussam",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Kumba",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Eyumojok",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Limbe",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Kribi",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Nkongsamba",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Edea",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Wum",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Kumbo",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Bafia",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Mbalmayo",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Eseka",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Bertoua",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Abong Mbang",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Batouri",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Belabo",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Meiganga",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Ngaoundere",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Tibati",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Kontcha",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Guider",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Mbe",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Douala",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Ebolowa",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Bamenda",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Garoua",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Maroua",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Yaounde",
      "timezone": "Africa/Douala"
    },
    {
      "city": "Selkirk",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Berens River",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Pukatawagan",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Gimli",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Island Lake",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Melville",
      "timezone": "America/Regina"
    },
    {
      "city": "Weyburn",
      "timezone": "America/Regina"
    },
    {
      "city": "La Ronge",
      "timezone": "America/Regina"
    },
    {
      "city": "Stony Rapids",
      "timezone": "America/Regina"
    },
    {
      "city": "Camrose",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Hinton",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Vegreville",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Stettler",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Lac La Biche",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Wetaskiwin",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Meander River",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Creston",
      "timezone": "America/Creston"
    },
    {
      "city": "Cranbrook",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Terrace",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Chilliwack",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Hall Beach",
      "timezone": "America/Iqaluit"
    },
    {
      "city": "Lutselke",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Hay River",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Déline",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Paulatuk",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Tsiigehtchic",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Owen Sound",
      "timezone": "America/Toronto"
    },
    {
      "city": "Orillia",
      "timezone": "America/Toronto"
    },
    {
      "city": "Kapuskasing",
      "timezone": "America/Toronto"
    },
    {
      "city": "Thessalon",
      "timezone": "America/Toronto"
    },
    {
      "city": "Geraldton",
      "timezone": "America/Toronto"
    },
    {
      "city": "Belleville",
      "timezone": "America/Toronto"
    },
    {
      "city": "Sarnia",
      "timezone": "America/Toronto"
    },
    {
      "city": "Peterborough",
      "timezone": "America/Toronto"
    },
    {
      "city": "Oshawa",
      "timezone": "America/Toronto"
    },
    {
      "city": "London",
      "timezone": "America/Toronto"
    },
    {
      "city": "Kitchener",
      "timezone": "America/Toronto"
    },
    {
      "city": "New Liskeard",
      "timezone": "America/Toronto"
    },
    {
      "city": "Brockville",
      "timezone": "America/Toronto"
    },
    {
      "city": "Big Beaver House",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Port-Menier",
      "timezone": "America/Montreal"
    },
    {
      "city": "Riviere-du-Loup",
      "timezone": "America/Montreal"
    },
    {
      "city": "Drummondville",
      "timezone": "America/Montreal"
    },
    {
      "city": "Sherbrooke",
      "timezone": "America/Montreal"
    },
    {
      "city": "Cap-Chat",
      "timezone": "America/Montreal"
    },
    {
      "city": "Baie-Comeau",
      "timezone": "America/Montreal"
    },
    {
      "city": "Natashquan",
      "timezone": "America/Montreal"
    },
    {
      "city": "Eastmain",
      "timezone": "America/Montreal"
    },
    {
      "city": "Schefferville",
      "timezone": "America/Montreal"
    },
    {
      "city": "Salluit",
      "timezone": "America/Montreal"
    },
    {
      "city": "Amos",
      "timezone": "America/Montreal"
    },
    {
      "city": "Joliette",
      "timezone": "America/Montreal"
    },
    {
      "city": "St.-Jerome",
      "timezone": "America/Montreal"
    },
    {
      "city": "St-Augustin",
      "timezone": "America/Blanc-Sablon"
    },
    {
      "city": "Rouyn-Noranda",
      "timezone": "America/Montreal"
    },
    {
      "city": "La Sarre",
      "timezone": "America/Montreal"
    },
    {
      "city": "New Glasgow",
      "timezone": "America/Halifax"
    },
    {
      "city": "Liverpool",
      "timezone": "America/Halifax"
    },
    {
      "city": "Amherst",
      "timezone": "America/Halifax"
    },
    {
      "city": "Baddeck",
      "timezone": "America/Halifax"
    },
    {
      "city": "Deer Lake",
      "timezone": "America/St_Johns"
    },
    {
      "city": "La Scie",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Hopedale",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Happy Valley - Goose Bay",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Port Hope Simpson",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Tofino",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Steinbach",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Nelson House",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Shamattawa",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Oxford House",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Yorkton",
      "timezone": "America/Regina"
    },
    {
      "city": "Swift Current",
      "timezone": "America/Regina"
    },
    {
      "city": "Biggar",
      "timezone": "America/Regina"
    },
    {
      "city": "Kindersley",
      "timezone": "America/Regina"
    },
    {
      "city": "Meadow Lake",
      "timezone": "America/Regina"
    },
    {
      "city": "Hudson Bay",
      "timezone": "America/Regina"
    },
    {
      "city": "Lethbridge",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Brooks",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Lake Louise",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Athabasca",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Fort Chipewyan",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Bella Bella",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Sandspit",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Campbell River",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Port Hardy",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Nanaimo",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Quesnel",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Abbotsford",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Dawson Creek",
      "timezone": "America/Dawson_Creek"
    },
    {
      "city": "Penticton",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Nelson",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Lillooet",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Powell River",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Revelstoke",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Burns Lake",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Dease Lake",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Coral Harbour",
      "timezone": "America/Coral_Harbour"
    },
    {
      "city": "Baker Lake",
      "timezone": "America/Rankin_Inlet"
    },
    {
      "city": "Norman Wells",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Fort McPherson",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Burwash Landing",
      "timezone": "America/Whitehorse"
    },
    {
      "city": "Orangeville",
      "timezone": "America/Toronto"
    },
    {
      "city": "Little Current",
      "timezone": "America/Toronto"
    },
    {
      "city": "Chapleau",
      "timezone": "America/Toronto"
    },
    {
      "city": "Wawa",
      "timezone": "America/Toronto"
    },
    {
      "city": "Hearst",
      "timezone": "America/Toronto"
    },
    {
      "city": "Marathon",
      "timezone": "America/Toronto"
    },
    {
      "city": "Sioux Lookout",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Red Lake",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Deer Lake",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Cat Lake",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Cornwall",
      "timezone": "America/Toronto"
    },
    {
      "city": "Kingston",
      "timezone": "America/Toronto"
    },
    {
      "city": "Barrie",
      "timezone": "America/Toronto"
    },
    {
      "city": "Parry Sound",
      "timezone": "America/Toronto"
    },
    {
      "city": "Wiarton",
      "timezone": "America/Toronto"
    },
    {
      "city": "Cobalt",
      "timezone": "America/Toronto"
    },
    {
      "city": "Cochrane",
      "timezone": "America/Toronto"
    },
    {
      "city": "Nipigon",
      "timezone": "America/Nipigon"
    },
    {
      "city": "Atikokan",
      "timezone": "America/Atikokan"
    },
    {
      "city": "Rimouski",
      "timezone": "America/Montreal"
    },
    {
      "city": "Saint-Georges",
      "timezone": "America/Montreal"
    },
    {
      "city": "Victoriaville",
      "timezone": "America/Montreal"
    },
    {
      "city": "Chevery",
      "timezone": "America/Blanc-Sablon"
    },
    {
      "city": "Mistassini",
      "timezone": "America/Montreal"
    },
    {
      "city": "Kangirsuk",
      "timezone": "America/Montreal"
    },
    {
      "city": "Shawinigan",
      "timezone": "America/Montreal"
    },
    {
      "city": "Matagami",
      "timezone": "America/Montreal"
    },
    {
      "city": "Mont-Laurier",
      "timezone": "America/Montreal"
    },
    {
      "city": "Pembroke",
      "timezone": "America/Montreal"
    },
    {
      "city": "Radisson",
      "timezone": "America/Montreal"
    },
    {
      "city": "Saint John",
      "timezone": "America/Moncton"
    },
    {
      "city": "Edmundston",
      "timezone": "America/Moncton"
    },
    {
      "city": "Shelburne",
      "timezone": "America/Halifax"
    },
    {
      "city": "Antigonish",
      "timezone": "America/Halifax"
    },
    {
      "city": "Windsor",
      "timezone": "America/Halifax"
    },
    {
      "city": "Digby",
      "timezone": "America/Halifax"
    },
    {
      "city": "Stephenville",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Argentia",
      "timezone": "America/St_Johns"
    },
    {
      "city": "St. Anthony",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Channel-Port aux Basques",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Buchans",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Trout River",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Churchill Falls",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Forteau",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Trepassey",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Brochet",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Lynn Lake",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Gillam",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "North Battleford",
      "timezone": "America/Regina"
    },
    {
      "city": "Prince Albert",
      "timezone": "America/Regina"
    },
    {
      "city": "Courtenay",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Kelowna",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Pangnirtung",
      "timezone": "America/Pangnirtung"
    },
    {
      "city": "Holman",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Dryden",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Attawapiskat",
      "timezone": "America/Toronto"
    },
    {
      "city": "Hamilton",
      "timezone": "America/Toronto"
    },
    {
      "city": "Windsor",
      "timezone": "America/Detroit"
    },
    {
      "city": "Trois-Rivières",
      "timezone": "America/Montreal"
    },
    {
      "city": "Sept-Îles",
      "timezone": "America/Montreal"
    },
    {
      "city": "Corner Brook",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Norway House",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Flin Flon",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Dauphin",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "The Pas",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Uranium City",
      "timezone": "America/Regina"
    },
    {
      "city": "Moose Jaw",
      "timezone": "America/Regina"
    },
    {
      "city": "Jasper",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Medicine Hat",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Red Deer",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Banff",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Grand Prairie",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Smithers",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Kamloops",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Williams Lake",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Prince George",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Fort Nelson",
      "timezone": "America/Fort_Nelson"
    },
    {
      "city": "Pond Inlet",
      "timezone": "America/Iqaluit"
    },
    {
      "city": "Cape Dorset",
      "timezone": "America/Iqaluit"
    },
    {
      "city": "Kimmirut",
      "timezone": "America/Iqaluit"
    },
    {
      "city": "Gjoa Haven",
      "timezone": "America/Cambridge_Bay"
    },
    {
      "city": "Grise Fiord",
      "timezone": "America/Iqaluit"
    },
    {
      "city": "Alert",
      "timezone": "America/Pangnirtung"
    },
    {
      "city": "Ennadai",
      "timezone": "America/Rankin_Inlet"
    },
    {
      "city": "Rankin Inlet",
      "timezone": "America/Rankin_Inlet"
    },
    {
      "city": "Fort Resolution",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Fort Simpson",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Inuvik",
      "timezone": "America/Inuvik"
    },
    {
      "city": "Tuktoyaktuk",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Watson Lake",
      "timezone": "America/Whitehorse"
    },
    {
      "city": "Lansdowne House",
      "timezone": "America/Toronto"
    },
    {
      "city": "Moosonee",
      "timezone": "America/Toronto"
    },
    {
      "city": "Sudbury",
      "timezone": "America/Toronto"
    },
    {
      "city": "Kenora",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Gaspe",
      "timezone": "America/Montreal"
    },
    {
      "city": "Mingan",
      "timezone": "America/Montreal"
    },
    {
      "city": "Dolbeau",
      "timezone": "America/Montreal"
    },
    {
      "city": "Val d'Or",
      "timezone": "America/Montreal"
    },
    {
      "city": "Ivugivik",
      "timezone": "America/Montreal"
    },
    {
      "city": "Inukjuak",
      "timezone": "America/Montreal"
    },
    {
      "city": "Chicoutimi",
      "timezone": "America/Montreal"
    },
    {
      "city": "Moncton",
      "timezone": "America/Moncton"
    },
    {
      "city": "Fredericton",
      "timezone": "America/Moncton"
    },
    {
      "city": "Bathurst",
      "timezone": "America/Moncton"
    },
    {
      "city": "Yarmouth",
      "timezone": "America/Halifax"
    },
    {
      "city": "Gander",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Cartwright",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Rigolet",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Port Burwell",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Thompson",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Brandon",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Fort Smith",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Fort McMurray",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Peace River",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Fort St. John",
      "timezone": null
    },
    {
      "city": "Iqaluit",
      "timezone": "America/Iqaluit"
    },
    {
      "city": "Cambridge Bay",
      "timezone": "America/Cambridge_Bay"
    },
    {
      "city": "Kugluktuk",
      "timezone": "America/Cambridge_Bay"
    },
    {
      "city": "Chesterfield Inlet",
      "timezone": "America/Rankin_Inlet"
    },
    {
      "city": "Arviat",
      "timezone": "America/Rankin_Inlet"
    },
    {
      "city": "Taloyoak",
      "timezone": "America/Cambridge_Bay"
    },
    {
      "city": "Igloolik",
      "timezone": "America/Iqaluit"
    },
    {
      "city": "Dawson City",
      "timezone": "America/Dawson"
    },
    {
      "city": "Timmins",
      "timezone": "America/Toronto"
    },
    {
      "city": "North Bay",
      "timezone": "America/Toronto"
    },
    {
      "city": "Kuujjuarapik",
      "timezone": "America/Montreal"
    },
    {
      "city": "Kuujjuaq",
      "timezone": "America/Montreal"
    },
    {
      "city": "Sydney",
      "timezone": "America/Glace_Bay"
    },
    {
      "city": "Labrador City",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Winnipeg",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Churchill",
      "timezone": "America/Winnipeg"
    },
    {
      "city": "Regina",
      "timezone": "America/Regina"
    },
    {
      "city": "Saskatoon",
      "timezone": "America/Regina"
    },
    {
      "city": "Calgary",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Prince Rupert",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Victoria",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Arctic Bay",
      "timezone": "America/Rankin_Inlet"
    },
    {
      "city": "Resolute",
      "timezone": "America/Resolute"
    },
    {
      "city": "Repulse Bay",
      "timezone": "America/Rankin_Inlet"
    },
    {
      "city": "Yellowknife",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Fort Good Hope",
      "timezone": "America/Yellowknife"
    },
    {
      "city": "Whitehorse",
      "timezone": "America/Whitehorse"
    },
    {
      "city": "Ottawa",
      "timezone": "America/Toronto"
    },
    {
      "city": "Fort Severn",
      "timezone": "America/Toronto"
    },
    {
      "city": "Thunder Bay",
      "timezone": "America/Thunder_Bay"
    },
    {
      "city": "Québec",
      "timezone": "America/Montreal"
    },
    {
      "city": "Halifax",
      "timezone": "America/Halifax"
    },
    {
      "city": "St. John’s",
      "timezone": "America/St_Johns"
    },
    {
      "city": "Nain",
      "timezone": "America/Goose_Bay"
    },
    {
      "city": "Charlottetown",
      "timezone": "America/Halifax"
    },
    {
      "city": "Edmonton",
      "timezone": "America/Edmonton"
    },
    {
      "city": "Montréal",
      "timezone": "America/Montreal"
    },
    {
      "city": "Vancouver",
      "timezone": "America/Vancouver"
    },
    {
      "city": "Toronto",
      "timezone": "America/Toronto"
    },
    {
      "city": "Mindelo",
      "timezone": "Atlantic/Cape_Verde"
    },
    {
      "city": "Praia",
      "timezone": "Atlantic/Cape_Verde"
    },
    {
      "city": "George Town",
      "timezone": "America/Cayman"
    },
    {
      "city": "Mobaye",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Mbaiki",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Carnot",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bozoum",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Kaga Bandoro",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Zemio",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Yakossi",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Nola",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Sibut",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bossangoa",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Birao",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Ouadda",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bangassou",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bossembele",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Berberati",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bria",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bouar",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bambari",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Ndele",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Obo",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Bangui",
      "timezone": "Africa/Bangui"
    },
    {
      "city": "Lai",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Zouar",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Bol",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Ati",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Oum Hadjer",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Mongo",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Doba",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Pala",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Bongor",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Kelo",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Fada",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Faya Largeau",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Mao",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Biltine",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Sarh",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Am Timan",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Moundou",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Ndjamena",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Abeche",
      "timezone": "Africa/Ndjamena"
    },
    {
      "city": "Rio Verde",
      "timezone": "America/Santiago"
    },
    {
      "city": "Cuya",
      "timezone": "America/Santiago"
    },
    {
      "city": "Chuquicamata",
      "timezone": "America/Santiago"
    },
    {
      "city": "Maria Elena",
      "timezone": "America/Santiago"
    },
    {
      "city": "Tierra Amarilla",
      "timezone": "America/Santiago"
    },
    {
      "city": "Combarbala",
      "timezone": "America/Santiago"
    },
    {
      "city": "San Bernardo",
      "timezone": "America/Santiago"
    },
    {
      "city": "San Felipe",
      "timezone": "America/Santiago"
    },
    {
      "city": "Vina del Mar",
      "timezone": "America/Santiago"
    },
    {
      "city": "La Ligua",
      "timezone": "America/Santiago"
    },
    {
      "city": "Quillota",
      "timezone": "America/Santiago"
    },
    {
      "city": "Nueva Imperial",
      "timezone": "America/Santiago"
    },
    {
      "city": "Loncoche",
      "timezone": "America/Santiago"
    },
    {
      "city": "Villarica",
      "timezone": "America/Santiago"
    },
    {
      "city": "Tolten",
      "timezone": "America/Santiago"
    },
    {
      "city": "Lonquimay",
      "timezone": "America/Santiago"
    },
    {
      "city": "Angol",
      "timezone": "America/Santiago"
    },
    {
      "city": "Collipulli",
      "timezone": "America/Santiago"
    },
    {
      "city": "La Union",
      "timezone": "America/Santiago"
    },
    {
      "city": "Rio Bueno",
      "timezone": "America/Santiago"
    },
    {
      "city": "Coronel",
      "timezone": "America/Santiago"
    },
    {
      "city": "Talcahuano",
      "timezone": "America/Santiago"
    },
    {
      "city": "Quirihue",
      "timezone": "America/Santiago"
    },
    {
      "city": "Curanilahue",
      "timezone": "America/Santiago"
    },
    {
      "city": "Santa Barbara",
      "timezone": "America/Santiago"
    },
    {
      "city": "Pichilemu",
      "timezone": "America/Santiago"
    },
    {
      "city": "San Fernando",
      "timezone": "America/Santiago"
    },
    {
      "city": "Puerto Varas",
      "timezone": "America/Santiago"
    },
    {
      "city": "Calbuco",
      "timezone": "America/Santiago"
    },
    {
      "city": "Castro",
      "timezone": "America/Santiago"
    },
    {
      "city": "Chonchi",
      "timezone": "America/Santiago"
    },
    {
      "city": "Linares",
      "timezone": "America/Santiago"
    },
    {
      "city": "Cauquenes",
      "timezone": "America/Santiago"
    },
    {
      "city": "Cochrane",
      "timezone": "America/Santiago"
    },
    {
      "city": "Lagunas",
      "timezone": "America/Santiago"
    },
    {
      "city": "Pozo Almonte",
      "timezone": "America/Santiago"
    },
    {
      "city": "Toconao",
      "timezone": "America/Santiago"
    },
    {
      "city": "Huasco",
      "timezone": "America/Santiago"
    },
    {
      "city": "Diego de Almagro",
      "timezone": "America/Santiago"
    },
    {
      "city": "Caldera",
      "timezone": "America/Santiago"
    },
    {
      "city": "Coquimbo",
      "timezone": "America/Santiago"
    },
    {
      "city": "Vicuna",
      "timezone": "America/Santiago"
    },
    {
      "city": "Illapel",
      "timezone": "America/Santiago"
    },
    {
      "city": "Salamanca",
      "timezone": "America/Santiago"
    },
    {
      "city": "Los Andes",
      "timezone": "America/Santiago"
    },
    {
      "city": "San Antonio",
      "timezone": "America/Santiago"
    },
    {
      "city": "Victoria",
      "timezone": "America/Santiago"
    },
    {
      "city": "Carahue",
      "timezone": "America/Santiago"
    },
    {
      "city": "Los Lagos",
      "timezone": "America/Santiago"
    },
    {
      "city": "Lota",
      "timezone": "America/Santiago"
    },
    {
      "city": "Lebu",
      "timezone": "America/Santiago"
    },
    {
      "city": "Quellon",
      "timezone": "America/Santiago"
    },
    {
      "city": "Constitucion",
      "timezone": "America/Santiago"
    },
    {
      "city": "Villa O'Higgins",
      "timezone": "America/Santiago"
    },
    {
      "city": "Puerto Aisen",
      "timezone": "America/Santiago"
    },
    {
      "city": "Puerto Natales",
      "timezone": "America/Santiago"
    },
    {
      "city": "Puerto Williams",
      "timezone": "America/Santiago"
    },
    {
      "city": "Temuco",
      "timezone": "America/Santiago"
    },
    {
      "city": "Tocopilla",
      "timezone": "America/Santiago"
    },
    {
      "city": "Calama",
      "timezone": "America/Santiago"
    },
    {
      "city": "Mejillones",
      "timezone": "America/Santiago"
    },
    {
      "city": "Taltal",
      "timezone": "America/Santiago"
    },
    {
      "city": "Vallenar",
      "timezone": "America/Santiago"
    },
    {
      "city": "Chanaral",
      "timezone": "America/Santiago"
    },
    {
      "city": "Ovalle",
      "timezone": "America/Santiago"
    },
    {
      "city": "Chillan",
      "timezone": "America/Santiago"
    },
    {
      "city": "Rancagua",
      "timezone": "America/Santiago"
    },
    {
      "city": "Osorno",
      "timezone": "America/Santiago"
    },
    {
      "city": "Ancud",
      "timezone": "America/Santiago"
    },
    {
      "city": "Talca",
      "timezone": "America/Santiago"
    },
    {
      "city": "Curico",
      "timezone": "America/Santiago"
    },
    {
      "city": "Coihaique",
      "timezone": "America/Santiago"
    },
    {
      "city": "Arica",
      "timezone": "America/Santiago"
    },
    {
      "city": "Copiapo",
      "timezone": "America/Santiago"
    },
    {
      "city": "La Serena",
      "timezone": "America/Santiago"
    },
    {
      "city": "Los Angeles",
      "timezone": "America/Santiago"
    },
    {
      "city": "Punta Arenas",
      "timezone": "America/Santiago"
    },
    {
      "city": "Iquique",
      "timezone": "America/Santiago"
    },
    {
      "city": "Antofagasta",
      "timezone": "America/Santiago"
    },
    {
      "city": "Valparaiso",
      "timezone": "America/Santiago"
    },
    {
      "city": "Valdivia",
      "timezone": "America/Santiago"
    },
    {
      "city": "Concepcion",
      "timezone": "America/Santiago"
    },
    {
      "city": "Puerto Montt",
      "timezone": "America/Santiago"
    },
    {
      "city": "Santiago",
      "timezone": "America/Santiago"
    },
    {
      "city": "Yumen",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Linxia",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Zhuozhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Sanming",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Huizhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Chaozhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Gyangze",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Dali",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Yangquan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shiyan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Danjiangkou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shashi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Anlu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zixing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Deyang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Tengchong",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Mengzi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Chuxiong",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Hengshui",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xuanhua",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Luohe",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Beipiao",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Wafangdian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhucheng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Hangu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xinyi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yangzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Linhai",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Huangyan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Daan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Changling",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Tonghua",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Baishan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Yanji",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Ergun Zuoqi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shangdu",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Orongen Zizhiqi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zalantun",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Wuchuan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Hanggin Houqi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Anda",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Qinggang",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Angangxi",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Hulan Ergi",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Qingan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Baiquan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Suileng",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Linkou",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Longxi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Pingliang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Anxi",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Minxian",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Jinchang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Guide",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Qinzhou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Pingxiang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Yishan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Beihai",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Hechi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Tongren",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Fengjie",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Changping",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shaowu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Longyan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhangzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Putian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Fuan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Changting",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Nanping",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Ninde",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jieshou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Tongling",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Maanshan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Fuyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yangjiang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Meizhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Heyuan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Qingyuan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhaoqing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Lianxian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jiangmen",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Maoming",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Gar",
      "timezone": "Asia/Kashgar"
    },
    {
      "city": "Turpan",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Quiemo",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Koktokay",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Hancheng",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Weinan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Shuozhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xinzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jincheng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jiexiu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Changzhi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Guangshui",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jingmen",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zicheng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shishou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xiaogan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Puqi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yunxian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jinshi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Chenzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhijiang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xiangtan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zigong",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Yaan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Langzhong",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Rongzhag",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Simao",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Wenshan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Zhanyi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Huize",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Chengde",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Cangzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Baoding",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Huanghua",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Dingzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Nangong",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Linqing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xiangtai",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Puyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Hebi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xuchang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhoukou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Dengzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Tieling",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Chaoyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Huanren",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhuanghe",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yishui",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shanxian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Pingyi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Pingdu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Laiwu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Buizhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Liaocheng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Rizhao",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Dezhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Linchuan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Fengcheng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shangrao",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jingdezhen",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Taizhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shuyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Lianyungang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Lishui",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jiaojing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Quzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Fuyu",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Dunhua",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Nongan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Taonan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Liuhe",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Huinan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Panshi",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Jiaohe",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Linjiang",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Wangqing",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Helong",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Shulan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Jiutai",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Alxa Zuoqi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Linxi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Kailu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Bairin Zuoqi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yitulihe",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yakeshi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Bugt",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Wuyuan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Bayan Obo",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Fengzhen",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Suihua",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Shuangyashan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Shangzhi",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Fujin",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Yian",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Tailai",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Longjiang",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Gannan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Hailun",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Mishan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Tieli",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Shuangcheng",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Zhaodong",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Lanxi",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Keshan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Nancha",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Xinqing",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Hulin",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Boli",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Ningan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Jyekundo",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Liuzhou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Xingyi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Anshun",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Zunyi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Wanzhou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Huaibei",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Wuhu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Luan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Bengbu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Anqing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Foshan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Nagchu",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Nyingchi",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Chamdo",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Korla",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Kuqa",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Tacheng",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Shihezi",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Karamay",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Aksu",
      "timezone": "Asia/Kashgar"
    },
    {
      "city": "Sanya",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Haikou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Hanzhong",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Baoji",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Tongchuan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Linfen",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yuci",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Datong",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jianmen",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yichang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xiantao",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Macheng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Huangshi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhuzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yongzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yiyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Changde",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shaoyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Leshan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Panzhihua",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Fulin",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Guangyuan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Luzhou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Yibin",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Zhaotang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Lijiang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Yuxi",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Dali",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Qinhuangdao",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Langfang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhangjiakou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Tangshan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Anyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jiaozuo",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Kaifeng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shangqiu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Pingdingshan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xinyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xinxiang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Luoyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Liaoyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Dandong",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yingkow",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jinzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Fuxin",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Benxi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Fushun",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jining",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Weifang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Taian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Heze",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Laiyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xinyu",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Ganzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jiujiang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Changzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhenjiang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Nantong",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jiaxing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Huzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shaoxing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jinhua",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Liaoyuan",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Tumen",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Siping",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Baicheng",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Wuhai",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Erenhot",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jining",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Arxan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Manzhouli",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xilinhot",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Heihe",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Qitaihe",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Yichun",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Hegang",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Nenjiang",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Nehe",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Mudangiang",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Xuanzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhuhai",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xianyang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Xiangfan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Suining",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Lingyuan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Weihai",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yichun",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yancheng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Fuyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xiamen",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Nanchong",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Neijiang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Nanyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jinxi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yantai",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zaozhuang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Suzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xuzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Wuxi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jilin",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Zhangye",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Wuwei",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Dunhuang",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Tianshui",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Dulan",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Golmud",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Yulin",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Bose",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Wuzhou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Lupanshui",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Quanzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Hefei",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Suzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zhanjiang",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Shaoguan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xigaze",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Shache",
      "timezone": "Asia/Kashgar"
    },
    {
      "city": "Yining",
      "timezone": "Asia/Kashgar"
    },
    {
      "city": "Altay",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Shizuishan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Yulin",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Ankang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Houma",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yueyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Hengyang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Mianyang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Xichang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Baoshan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Gejiu",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Shijianzhuang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Handan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Anshan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Dalian",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Qingdao",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Linyi",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Huaiyin",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Wenzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Ningbo",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Tongliao",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Hohhot",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Chifeng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Ulanhot",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Hailar",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jiamusi",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Beian",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Daqing",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Jixi",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Jiayuguan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Xining",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Guilin",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Huainan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shantou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Lhasa",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Hami",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Hotan",
      "timezone": "Asia/Kashgar"
    },
    {
      "city": "Kashgar",
      "timezone": "Asia/Kashgar"
    },
    {
      "city": "Yinchuan",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Pingxiang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Qiqihar",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Shenzhen",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Zibo",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Lanzhou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Nanning",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Guiyang",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Chongqing",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Fuzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Guangzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Dongguan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Xian",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Taiyuan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Wuhan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Changsha",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Kunming",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Zhengzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shenyeng",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Jinan",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Tianjin",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Nanchang",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Nanjing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Hangzhou",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Changchun",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Baotou",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Harbin",
      "timezone": "Asia/Harbin"
    },
    {
      "city": "Urumqi",
      "timezone": "Asia/Urumqi"
    },
    {
      "city": "Chengdu",
      "timezone": "Asia/Chongqing"
    },
    {
      "city": "Beijing",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Shanghai",
      "timezone": "Asia/Shanghai"
    },
    {
      "city": "Yopal",
      "timezone": "America/Bogota"
    },
    {
      "city": "San Andres",
      "timezone": "America/Bogota"
    },
    {
      "city": "Sonson",
      "timezone": "America/Bogota"
    },
    {
      "city": "Sogamoso",
      "timezone": "America/Bogota"
    },
    {
      "city": "Barrancabermeja",
      "timezone": "America/Bogota"
    },
    {
      "city": "Girardot",
      "timezone": "America/Bogota"
    },
    {
      "city": "Campoalegre",
      "timezone": "America/Bogota"
    },
    {
      "city": "Tuquerres",
      "timezone": "America/Bogota"
    },
    {
      "city": "Mocoa",
      "timezone": "America/Bogota"
    },
    {
      "city": "Cartago",
      "timezone": "America/Bogota"
    },
    {
      "city": "Soledad",
      "timezone": "America/Bogota"
    },
    {
      "city": "Sabanalarga",
      "timezone": "America/Bogota"
    },
    {
      "city": "Arjona",
      "timezone": "America/Bogota"
    },
    {
      "city": "Magangue",
      "timezone": "America/Bogota"
    },
    {
      "city": "Valledupar",
      "timezone": "America/Bogota"
    },
    {
      "city": "San Jose del Guaviare",
      "timezone": "America/Bogota"
    },
    {
      "city": "Puerto Lopez",
      "timezone": "America/Bogota"
    },
    {
      "city": "Yarumal",
      "timezone": "America/Bogota"
    },
    {
      "city": "Puerto Berrio",
      "timezone": "America/Bogota"
    },
    {
      "city": "Turbo",
      "timezone": "America/Bogota"
    },
    {
      "city": "Tunja",
      "timezone": "America/Bogota"
    },
    {
      "city": "Chiquinquira",
      "timezone": "America/Bogota"
    },
    {
      "city": "Duitama",
      "timezone": "America/Bogota"
    },
    {
      "city": "Ayapel",
      "timezone": "America/Bogota"
    },
    {
      "city": "Lorica",
      "timezone": "America/Bogota"
    },
    {
      "city": "Socorro",
      "timezone": "America/Bogota"
    },
    {
      "city": "Riohacha",
      "timezone": "America/Bogota"
    },
    {
      "city": "Armenia",
      "timezone": "America/Bogota"
    },
    {
      "city": "Pereira",
      "timezone": "America/Bogota"
    },
    {
      "city": "Honda",
      "timezone": "America/Bogota"
    },
    {
      "city": "San Vicente del Caguan",
      "timezone": "America/Bogota"
    },
    {
      "city": "Florencia",
      "timezone": "America/Bogota"
    },
    {
      "city": "Guapi",
      "timezone": "America/Bogota"
    },
    {
      "city": "Neiva",
      "timezone": "America/Bogota"
    },
    {
      "city": "Garzon",
      "timezone": "America/Bogota"
    },
    {
      "city": "Ipiales",
      "timezone": "America/Bogota"
    },
    {
      "city": "Buenaventura",
      "timezone": "America/Bogota"
    },
    {
      "city": "Tulua",
      "timezone": "America/Bogota"
    },
    {
      "city": "El Carmen de Bolivar",
      "timezone": "America/Bogota"
    },
    {
      "city": "Jurado",
      "timezone": "America/Bogota"
    },
    {
      "city": "Nuqui",
      "timezone": "America/Bogota"
    },
    {
      "city": "Quibdo",
      "timezone": "America/Bogota"
    },
    {
      "city": "El Banco",
      "timezone": "America/Bogota"
    },
    {
      "city": "Cienaga",
      "timezone": "America/Bogota"
    },
    {
      "city": "Sincelejo",
      "timezone": "America/Bogota"
    },
    {
      "city": "Tolu",
      "timezone": "America/Bogota"
    },
    {
      "city": "Arauca",
      "timezone": "America/Bogota"
    },
    {
      "city": "Tame",
      "timezone": "America/Bogota"
    },
    {
      "city": "Pamplona",
      "timezone": "America/Bogota"
    },
    {
      "city": "Ocana",
      "timezone": "America/Bogota"
    },
    {
      "city": "Orocue",
      "timezone": "America/Bogota"
    },
    {
      "city": "Obando",
      "timezone": "America/Bogota"
    },
    {
      "city": "San Martin",
      "timezone": "America/Bogota"
    },
    {
      "city": "Puerto Carreno",
      "timezone": "America/Bogota"
    },
    {
      "city": "Bello",
      "timezone": "America/Bogota"
    },
    {
      "city": "Monteria",
      "timezone": "America/Bogota"
    },
    {
      "city": "Bucaramanga",
      "timezone": "America/Bogota"
    },
    {
      "city": "Ibague",
      "timezone": "America/Bogota"
    },
    {
      "city": "Popayan",
      "timezone": "America/Bogota"
    },
    {
      "city": "Santa Marta",
      "timezone": "America/Bogota"
    },
    {
      "city": "Cucuta",
      "timezone": "America/Bogota"
    },
    {
      "city": "Villavicencio",
      "timezone": "America/Bogota"
    },
    {
      "city": "Tumaco",
      "timezone": "America/Bogota"
    },
    {
      "city": "Manizales",
      "timezone": "America/Bogota"
    },
    {
      "city": "Pasto",
      "timezone": "America/Bogota"
    },
    {
      "city": "Barranquilla",
      "timezone": "America/Bogota"
    },
    {
      "city": "Cartagena",
      "timezone": "America/Bogota"
    },
    {
      "city": "Mitu",
      "timezone": "America/Bogota"
    },
    {
      "city": "Leticia",
      "timezone": "America/Bogota"
    },
    {
      "city": "Medellin",
      "timezone": "America/Bogota"
    },
    {
      "city": "Cali",
      "timezone": "America/Bogota"
    },
    {
      "city": "Bogota",
      "timezone": "America/Bogota"
    },
    {
      "city": "Moroni",
      "timezone": "Indian/Comoro"
    },
    {
      "city": "Madingou",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Kinkala",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Ewo",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Impfondo",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Sembe",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Moloundou",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Owando",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Makoua",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Sibiti",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Mossendjo",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Loubomo",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Gamboma",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Djambala",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Ouesso",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Kayes",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Pointe-Noire",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Brazzaville",
      "timezone": "Africa/Brazzaville"
    },
    {
      "city": "Buluko",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Zongo",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Libenge",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Bongandanga",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Ikela",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Binga",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Basankusu",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Boende",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Gbadolite",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Businga",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Bosobolo",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Yangambi",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Aketi",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Mongbwalu",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Bafwasende",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Bunia",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Wamba",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Basoko",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kenge",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Bolobo",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kahemba",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Bulungu",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Lusanga",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Mangai",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kasongo-Lunda",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Mushie",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Dibaya",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Mweka",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Luebo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Demba",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Ilebo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Moanda",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kimpese",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kasangulu",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Mbanza-Ngungu",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Tshela",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Mwenga",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kampene",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kalima",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Lubutu",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kabinda",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Lubao",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Lusambo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Gandajika",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Lodja",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Dilolo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Nyunzu",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kasaji",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Luanza",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Moba",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Bukama",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kaniama",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kipushi",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kambove",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kongolo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kabalo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Beni",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Lisala",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Gemena",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Buta",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Watsa",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Isiro",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Bondo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Inongo",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Tshikapa",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Boma",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Bukavu",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Uvira",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kindu",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Mwene-Ditu",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Likasi",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Manono",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kamina",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Mbandaka",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kisangani",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Bandundu",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kananga",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kasongo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Mbuji-Mayi",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kalemie",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Butembo",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Goma",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Bumba",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kikwit",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Matadi",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Kolwezi",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Lubumbashi",
      "timezone": "Africa/Lubumbashi"
    },
    {
      "city": "Kinshasa",
      "timezone": "Africa/Kinshasa"
    },
    {
      "city": "Rarotonga",
      "timezone": "Pacific/Rarotonga"
    },
    {
      "city": "Heredia",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Cartago",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Golfito",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Alajuela",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Canas",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Sixaola",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Puntarenas",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Ciudad Cortes",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Quesada",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Liberia",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "La Cruz",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Puerto Limon",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "San Jose",
      "timezone": "America/Costa_Rica"
    },
    {
      "city": "Sibenik",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Karlovac",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Rijeka",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Slavonski Brod",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Dubrovnik",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Split",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Zadar",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Pula",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Osijek",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Zagreb",
      "timezone": "Europe/Zagreb"
    },
    {
      "city": "Ciego de Avila",
      "timezone": "America/Havana"
    },
    {
      "city": "Palma Soriano",
      "timezone": "America/Havana"
    },
    {
      "city": "San Antonio de los Banos",
      "timezone": "America/Havana"
    },
    {
      "city": "Guines",
      "timezone": "America/Havana"
    },
    {
      "city": "Caibarien",
      "timezone": "America/Havana"
    },
    {
      "city": "Placetas",
      "timezone": "America/Havana"
    },
    {
      "city": "Cienfuegos",
      "timezone": "America/Havana"
    },
    {
      "city": "Nueva Gerona",
      "timezone": "America/Havana"
    },
    {
      "city": "Sancti Spiritus",
      "timezone": "America/Havana"
    },
    {
      "city": "Moron",
      "timezone": "America/Havana"
    },
    {
      "city": "Nuevitas",
      "timezone": "America/Havana"
    },
    {
      "city": "Manzanillo",
      "timezone": "America/Havana"
    },
    {
      "city": "Bayamo",
      "timezone": "America/Havana"
    },
    {
      "city": "Banes",
      "timezone": "America/Havana"
    },
    {
      "city": "Las Tunas",
      "timezone": "America/Havana"
    },
    {
      "city": "Artemisa",
      "timezone": "America/Havana"
    },
    {
      "city": "Matanzas",
      "timezone": "America/Havana"
    },
    {
      "city": "Colon",
      "timezone": "America/Havana"
    },
    {
      "city": "Sagua la Grande",
      "timezone": "America/Havana"
    },
    {
      "city": "Pinar del Rio",
      "timezone": "America/Havana"
    },
    {
      "city": "Camaguey",
      "timezone": "America/Havana"
    },
    {
      "city": "Guantanamo",
      "timezone": "America/Havana"
    },
    {
      "city": "Holguin",
      "timezone": "America/Havana"
    },
    {
      "city": "Santa Clara",
      "timezone": "America/Havana"
    },
    {
      "city": "Santiago de Cuba",
      "timezone": "America/Havana"
    },
    {
      "city": "Havana",
      "timezone": "America/Havana"
    },
    {
      "city": "Willemstad",
      "timezone": "America/Curacao"
    },
    {
      "city": "Larnaka",
      "timezone": "Asia/Nicosia"
    },
    {
      "city": "Paphos",
      "timezone": "Asia/Nicosia"
    },
    {
      "city": "Lemosos",
      "timezone": "Asia/Nicosia"
    },
    {
      "city": "Nicosia",
      "timezone": "Asia/Nicosia"
    },
    {
      "city": "Usti Nad Labem",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Hradec Kralove",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Ceske Budejovice",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Liberec",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Olomouc",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Pizen",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Jihlava",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Zlin",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Brno",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Pardubice",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Ostrava",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Prague",
      "timezone": "Europe/Prague"
    },
    {
      "city": "Vejle",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Hillerod",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Soro",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Viborg",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Roskilde",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Svendborg",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Odense",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Esbjerg",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Frederikshavn",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Aalborg",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Århus",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "København",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Dikhil",
      "timezone": "Africa/Djibouti"
    },
    {
      "city": "Tadjoura",
      "timezone": "Africa/Djibouti"
    },
    {
      "city": "Ali Sabih",
      "timezone": "Africa/Djibouti"
    },
    {
      "city": "Obock",
      "timezone": "Africa/Djibouti"
    },
    {
      "city": "Djibouti",
      "timezone": "Africa/Djibouti"
    },
    {
      "city": "Roseau",
      "timezone": "America/Dominica"
    },
    {
      "city": "Sabaneta",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Mao",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Cotui",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Puerto Plata",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Dajabon",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Moca",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Salcedo",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Jimani",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Comendador",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Pedernales",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Azua",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Bonao",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Bani",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Hato Mayor",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Monte Plata",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Nagua",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Samana",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "San Cristobal",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "El Seibo",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Higuey",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Neiba",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "La Vega",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "San Francisco de Macoris",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "San Pedro de Macoris",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Monte Cristi",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Barahona",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Bavaro",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "La Romana",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "San Juan",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Santiago",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Santo Domingo",
      "timezone": "America/Santo_Domingo"
    },
    {
      "city": "Dili",
      "timezone": "Asia/Dili"
    },
    {
      "city": "Puyo",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Tulcan",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Pinas",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Puerto Villamil",
      "timezone": "Pacific/Galapagos"
    },
    {
      "city": "Puerto Baquerizo Moreno",
      "timezone": "Pacific/Galapagos"
    },
    {
      "city": "Guaranda",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Azogues",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Salinas",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Alausi",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Sangolqui",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Muisne",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "San Gabriel",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Macara",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Zamora",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Latacunga",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Milagro",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Babahoyo",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Chone",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Jipijapa",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Yaupi",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Macas",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Cayambe",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Ambato",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Tena",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Valdez",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "San Lorenzo",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Esmeraldas",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Ibarra",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Portoviejo",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Machala",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Loja",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Manta",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Riobamba",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Cuenca",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Santa Cruz",
      "timezone": "Pacific/Galapagos"
    },
    {
      "city": "Quito",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Guayaquil",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Shibin el Kom",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Benha",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Zagazig",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Kafr el Sheikh",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Tanta",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Ismailia",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Mansura",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Dumyat",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Matruh",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Alamein",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Daba",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Salum",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Damanhûr",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Samalut",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Mallawi",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Beni Mazar",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Beni Suef",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Rashid",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Qasr Farafra",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Qasr",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Isna",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Qena",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Girga",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Sohag",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Berenice",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Bur Safaga",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Tur",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Arish",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Giza",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Siwa",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Minya",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Kom Ombo",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Kharga",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Hurghada",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Suez",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Bur Said",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "El Faiyum",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Aswan",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Asyut",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Luxor",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Alexandria",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Cairo",
      "timezone": "Africa/Cairo"
    },
    {
      "city": "Ahuachapan",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Cojutepeque",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Nueva San Salvador",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Zacatecoluca",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "La Union",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "San Francisco Gotera",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "San Vicente",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Usulutan",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Chalatenango",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Sensuntepeque",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Sonsonate",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "San Miguel",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Santa Ana",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "San Salvador",
      "timezone": "America/El_Salvador"
    },
    {
      "city": "Evinayong",
      "timezone": "Africa/Malabo"
    },
    {
      "city": "Luba",
      "timezone": "Africa/Malabo"
    },
    {
      "city": "Calatrava",
      "timezone": "Africa/Malabo"
    },
    {
      "city": "Mongomo",
      "timezone": "Africa/Malabo"
    },
    {
      "city": "Bata",
      "timezone": "Africa/Malabo"
    },
    {
      "city": "Malabo",
      "timezone": "Africa/Malabo"
    },
    {
      "city": "Tessenei",
      "timezone": "Africa/Asmara"
    },
    {
      "city": "Agordat",
      "timezone": "Africa/Asmara"
    },
    {
      "city": "Massawa",
      "timezone": "Africa/Asmara"
    },
    {
      "city": "Keren",
      "timezone": "Africa/Asmara"
    },
    {
      "city": "Mendefera",
      "timezone": "Africa/Asmara"
    },
    {
      "city": "Assab",
      "timezone": "Africa/Asmara"
    },
    {
      "city": "Asmara",
      "timezone": "Africa/Asmara"
    },
    {
      "city": "Haapsalu",
      "timezone": "Europe/Tallinn"
    },
    {
      "city": "Viljandi",
      "timezone": "Europe/Tallinn"
    },
    {
      "city": "Kohtla-Jarve",
      "timezone": "Europe/Tallinn"
    },
    {
      "city": "Narva",
      "timezone": "Europe/Tallinn"
    },
    {
      "city": "Tartu",
      "timezone": "Europe/Tallinn"
    },
    {
      "city": "Parnu",
      "timezone": "Europe/Tallinn"
    },
    {
      "city": "Tallinn",
      "timezone": "Europe/Tallinn"
    },
    {
      "city": "Awasa",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Gore",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Debre Birhan",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Bati",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Adigrat",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Aksum",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Yirga Alem",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Hosaina",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Dila",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Giyon",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Hagere Hiywet",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Nekemte",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Asela",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Shashemene",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Dembi Dolo",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Gimbi",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Asosa",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Jijiga",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Debre Markos",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Dese",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Sodo",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Arba Minch",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Harar",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Goba",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Jima",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Nazret",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Nagele",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Gode",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Dolo Bay",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Bahir Dar",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Mekele",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Dire Dawa",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Gonder",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Addis Ababa",
      "timezone": "Africa/Addis_Ababa"
    },
    {
      "city": "Fox Bay",
      "timezone": "Atlantic/Stanley"
    },
    {
      "city": "Stanley",
      "timezone": "Atlantic/Stanley"
    },
    {
      "city": "Klaksvik",
      "timezone": "Atlantic/Faroe"
    },
    {
      "city": "Tórshavn",
      "timezone": "Atlantic/Faroe"
    },
    {
      "city": "Palikir",
      "timezone": "Pacific/Pohnpei"
    },
    {
      "city": "Nandi",
      "timezone": "Pacific/Fiji"
    },
    {
      "city": "Lautoka",
      "timezone": "Pacific/Fiji"
    },
    {
      "city": "Labasa",
      "timezone": "Pacific/Fiji"
    },
    {
      "city": "Suva",
      "timezone": "Pacific/Fiji"
    },
    {
      "city": "Hameenlinna",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Kouvola",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Mikkeli",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Savonlinna",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Pori",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Sodankylä",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Jyväskylä",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Kuopio",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Lappeenranta",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Porvoo",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Kemijarvi",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Kokkola",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Lahti",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Joensuu",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Turku",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Kemi",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Oulu",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Rovaniemi",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Vaasa",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Tampere",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Helsinki",
      "timezone": "Europe/Helsinki"
    },
    {
      "city": "Annecy",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Roanne",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Roura",
      "timezone": "America/Cayenne"
    },
    {
      "city": "Sinnamary",
      "timezone": "America/Cayenne"
    },
    {
      "city": "St.-Brieuc",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Poitier",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Angers",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Biarritz",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Aix-en-Provence",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Perpignan",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Tarbes",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Clermont-Ferrand",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Melun",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Arras",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Besancon",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Saint-Georges",
      "timezone": "America/Cayenne"
    },
    {
      "city": "Saint-Etienne",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Grenoble",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Fort-de-France",
      "timezone": "America/Martinique"
    },
    {
      "city": "Saint-Laurent-du-Maroni",
      "timezone": "America/Cayenne"
    },
    {
      "city": "Iracoubo",
      "timezone": "America/Cayenne"
    },
    {
      "city": "Cherbourg",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Caen",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Lorient",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Brest",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Le Mans",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Nantes",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Agen",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Ajaccio",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Bastia",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Toulon",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Beziers",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Montpellier",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Nimes",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Vichy",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Nevers",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Auxerre",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Dijon",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Bourges",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Tours",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Orleans",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Dieppe",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Rouen",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Versailles",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Brive",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Troyes",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Reims",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Calais",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Amiens",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Mulhouse",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Nancy",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Metz",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Pointe-a-Pitre",
      "timezone": "America/Guadeloupe"
    },
    {
      "city": "Basse-terre",
      "timezone": "America/Guadeloupe"
    },
    {
      "city": "St.-Benoit",
      "timezone": "Indian/Reunion"
    },
    {
      "city": "Dzaoudzi",
      "timezone": "Indian/Mayotte"
    },
    {
      "city": "Rennes",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Nice",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Toulouse",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Limoges",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Lille",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Strasbourg",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Kourou",
      "timezone": "America/Cayenne"
    },
    {
      "city": "La Rochelle",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Bordeaux",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Marseille",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Le Havre",
      "timezone": "Europe/Paris"
    },
    {
      "city": "St.-Denis",
      "timezone": "Indian/Reunion"
    },
    {
      "city": "Lyon",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Cayenne",
      "timezone": "America/Cayenne"
    },
    {
      "city": "Paris",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Papeete",
      "timezone": "Pacific/Tahiti"
    },
    {
      "city": "Ebebiyin",
      "timezone": "Africa/Malabo"
    },
    {
      "city": "Tchibanga",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Mekambo",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Makokou",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Mitzik",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Bitam",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Lambarene",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Bifoum",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Ndende",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Mouila",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Omboue",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Moanda",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Okandja",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Koulamoutou",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Oyem",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Mayumba",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Gamba",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Franceville",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Libreville",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Port-Gentil",
      "timezone": "Africa/Libreville"
    },
    {
      "city": "Kutaisi",
      "timezone": "Asia/Tbilisi"
    },
    {
      "city": "Tskhinvali",
      "timezone": "Asia/Tbilisi"
    },
    {
      "city": "Poti",
      "timezone": "Asia/Tbilisi"
    },
    {
      "city": "Rustavi",
      "timezone": "Asia/Tbilisi"
    },
    {
      "city": "Batumi",
      "timezone": "Asia/Tbilisi"
    },
    {
      "city": "Sukhumi",
      "timezone": "Asia/Tbilisi"
    },
    {
      "city": "Tbilisi",
      "timezone": "Asia/Tbilisi"
    },
    {
      "city": "Mainz",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Schwerin",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Bielefeld",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Dortmund",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Duisburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Wuppertal",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Essen",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Karlsruhe",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Heidelberg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Kassel",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Oldenburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Emden",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Braunschweig",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Erfurt",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Coburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Augsburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Furth",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Chemnitz",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Bonn",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Münster",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Düsseldorf",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Ulm",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Mannheim",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Freiburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Giessen",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Wiesbaden",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Bremerhaven",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Osnabrück",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Hannover",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Gottingen",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Gera",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Jena",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Flensburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Lubeck",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Kiel",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Koblenz",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Saarbrucken",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Regensburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Rosenheim",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Hof",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Wurzburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Ingolstadt",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Cottbus",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Potsdam",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Magdeburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Leipzig",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Stralsund",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Rostock",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Stuttgart",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Bremen",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Nürnberg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Cologne",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Dresden",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Frankfurt",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Hamburg",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Munich",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Berlin",
      "timezone": "Europe/Berlin"
    },
    {
      "city": "Sunyani",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Tamale",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Yendi",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Bolgatanga",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Bawku",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Wa",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Obuasi",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Berekum",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Winneba",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Cape Coast",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Nkawkaw",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Koforidua",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Tema",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Ho",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Kumasi",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Sekondi",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Accra",
      "timezone": "Africa/Accra"
    },
    {
      "city": "Gibraltar",
      "timezone": "Europe/Gibraltar"
    },
    {
      "city": "Lamia",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Polygyros",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Komatini",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Piraiévs",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Volos",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Hania",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Kavala",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Alexandroupoli",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Kerkira",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Tripoli",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Sparti",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Agrinio",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Pirgos",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Larissa",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Ioanina",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Mitilini",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Hios",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Chalkida",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Sitia",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Katerini",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Seres",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Xanthi",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Ermoupoli",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Kos",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Rodos",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Patra",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Kalamata",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Iraklio",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Thessaloniki",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Athens",
      "timezone": "Europe/Athens"
    },
    {
      "city": "Qasigiannguit",
      "timezone": "America/Godthab"
    },
    {
      "city": "Kullorsuaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Tasiusaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Kulusuk",
      "timezone": "America/Godthab"
    },
    {
      "city": "Paamiut",
      "timezone": "America/Godthab"
    },
    {
      "city": "Ittoqqortoormiit",
      "timezone": "America/Danmarkshavn"
    },
    {
      "city": "Timmiarmiut",
      "timezone": "America/Godthab"
    },
    {
      "city": "Qaqortoq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Kangerlussuaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Nord",
      "timezone": "America/Godthab"
    },
    {
      "city": "Qeqertasuaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Nuussuaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Ilulissat",
      "timezone": "America/Godthab"
    },
    {
      "city": "Tasiilaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Savissivik",
      "timezone": "America/Thule"
    },
    {
      "city": "Kangersuatsiaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Uummannaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Narsarsuaq",
      "timezone": "America/Godthab"
    },
    {
      "city": "Sisimiut",
      "timezone": "America/Godthab"
    },
    {
      "city": "Upernavik",
      "timezone": "America/Godthab"
    },
    {
      "city": "Qaanaaq",
      "timezone": "America/Thule"
    },
    {
      "city": "Nuuk",
      "timezone": "America/Godthab"
    },
    {
      "city": "Saint George's",
      "timezone": "America/Grenada"
    },
    {
      "city": "Agana",
      "timezone": "Pacific/Guam"
    },
    {
      "city": "Salama",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Retalhuleu",
      "timezone": "America/Guatemala"
    },
    {
      "city": "San Marcos",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Chimaltenango",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Antigua Guatemala",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Solola",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Totonicapan",
      "timezone": "America/Guatemala"
    },
    {
      "city": "El Progreso",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Cuilapa",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Chiquimula",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Jalapa",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Zacapa",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Santa Cruz Del Quiche",
      "timezone": "America/Guatemala"
    },
    {
      "city": "San Luis",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Coban",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Livingston",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Jutiapa",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Huehuetenango",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Flores",
      "timezone": "America/Guatemala"
    },
    {
      "city": "La Libertad",
      "timezone": "America/Guatemala"
    },
    {
      "city": "San Jose",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Escuintla",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Mazatenango",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Puerto Barrios",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Quetzaltenango",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Guatemala",
      "timezone": "America/Guatemala"
    },
    {
      "city": "Mali",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Tongue",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Kouroussa",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Pita",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Dalaba",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Boffa",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Koundara",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Gaoual",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Telimele",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Forecariah",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Beyla",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Gueckedou",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Dinguiraye",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Dabola",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Kerouane",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Siguiri",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Mamou",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Kamsar",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Fria",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Macenta",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Yomou",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Faranah",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Kissidougou",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Labe",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Boke",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Kindia",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Kankan",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Nzerekore",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Conakry",
      "timezone": "Africa/Conakry"
    },
    {
      "city": "Cacheu",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Farim",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Fulacunda",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Gabu",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Catio",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Bolama",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Bafata",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Bissau",
      "timezone": "Africa/Bissau"
    },
    {
      "city": "Corriverton",
      "timezone": "America/Guyana"
    },
    {
      "city": "Ituni",
      "timezone": "America/Guyana"
    },
    {
      "city": "Lethem",
      "timezone": "America/Guyana"
    },
    {
      "city": "Kumaka",
      "timezone": "America/Guyana"
    },
    {
      "city": "Bartica",
      "timezone": "America/Guyana"
    },
    {
      "city": "Anna Regina",
      "timezone": "America/Guyana"
    },
    {
      "city": "Linden",
      "timezone": "America/Guyana"
    },
    {
      "city": "Mabaruma",
      "timezone": "America/Guyana"
    },
    {
      "city": "New Amsterdam",
      "timezone": "America/Guyana"
    },
    {
      "city": "Georgetown",
      "timezone": "America/Guyana"
    },
    {
      "city": "Jeremie",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Port-De-Paix",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Hinche",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Fort-Liberte",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Jacmel",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Les Cayes",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Gonaives",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Cap-Haitien",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Port-au-Prince",
      "timezone": "America/Port-au-Prince"
    },
    {
      "city": "Yoro",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "La Esperanza",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "La Paz",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Santa Barbara",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Gracias",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Nueva Ocotepeque",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Yuscaran",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Roatan",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Nacaome",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Santa Rosa de Copan",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Trujillo",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Brus Laguna",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Puerto Lempira",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Juticalpa",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Comayagua",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Choluteca",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "La Ceiba",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "San Pedro Sula",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Tegucigalpa",
      "timezone": "America/Tegucigalpa"
    },
    {
      "city": "Hong Kong",
      "timezone": "Asia/Hong_Kong"
    },
    {
      "city": "Veszprem",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Zalaegerszeg",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Tatabanya",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Szekszard",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Salgotarjan",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Bekescsaba",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Eger",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Szombathely",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Kecskemet",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Szekesfehervar",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Nyiregyhaza",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Pecs",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Gyor",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Kaposvar",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Vac",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Miskolc",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Szeged",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Debrecen",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Szolnok",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Budapest",
      "timezone": "Europe/Budapest"
    },
    {
      "city": "Borgarnes",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Egilsstaðir",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Sauðárkrókur",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Selfoss",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Hofn",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Ísafjörður",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Akureyi",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Keflavík",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Reykjavík",
      "timezone": "Atlantic/Reykjavik"
    },
    {
      "city": "Panaji",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Simla",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Gurgaon",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sonipat",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Rohtak",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hisar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhiwani",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ambala",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sopore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Silvassa",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kalyan",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhusawal",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jorhat",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hoshiarpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ajmer",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hathras",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sitapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Pilibhit",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Budaun",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Firozabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Mathura",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bulandshahr",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Muzaffarnagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Gangtok",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Diu",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Pathankot",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sirsa",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Panipat",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Karnal",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Baramula",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Proddatur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Nandyal",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hindupur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tirupati",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ongole",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Vizianagaram",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Rajahmundry",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Machilipatnam",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Khammam",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Chirala",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Karimnagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Nizamabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kollam",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Alappuzha",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Puri",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sambalpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Raurkela",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kavaratti",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Mandya",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kolar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Shimoga",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Raichur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hospet",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bidar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sangli",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Parbhani",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Malegaon",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Port Blair",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tezpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Silchar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kohima",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Shillong",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Abohar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Patiala",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhilwara",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Pali",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tonk",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sikar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bikaner",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bharatpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Alwar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Fatehpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Faizabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bahraich",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Mirzapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jhansi",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Shahjahanpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Rampur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bareilly",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Etawah",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Dehra Dun",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Haora",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Alipur Duar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Haldia",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhatpara",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Medinipur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Siliguri",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Purnia",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Muzaffarpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Aurangabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bilaspur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Burhanpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ujjain",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ratlam",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Vellore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tiruvannamalai",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Rajapalaiyam",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Cuddalore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Karur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kanchipuram",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tirunelveli",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Nagercoil",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Thanjavur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kumbakonam",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Valparai",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tiruppur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Daman",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Navsari",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhuj",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhavnagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Gandhinagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Itanagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Aizawl",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Agartala",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kakinada",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Warangal",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Brahmapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bijapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhiwandi",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Latur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ahmednagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Chandrapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Amravati",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Dhule",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Dibrugarh",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Imphal",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Udaipur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Gorakhpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Barddhaman",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Krishnanagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Gaya",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Porbandar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Nellore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kurnool",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Guntur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tumkur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Davangere",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bellary",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Belgaum",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tuticorin",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Dindigul",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Chandigarh",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jammu",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Sholapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Aurangabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Nasik",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Dispur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jullundur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Allahabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Moradabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ghaziabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Agra",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Aligarh",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Meerut",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Dhanbad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Gwalior",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Vadodara",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Rajkot",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Faridabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Srinagar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Vijayawada",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Thiruvananthapuram",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kochi",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Cuttack",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hubli",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Mangalore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Mysore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Gulbarga",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kolhapur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Nanded",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Akola",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Guwahati",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ludhiana",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kota",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jodhpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Lucknow",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Saharanpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ranchi",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhagalpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Raipur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jabalpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Indore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Pondicherry",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Salem",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Tiruchirappalli",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kozhikode",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhubaneshwar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jamshedpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Vishakhapatnam",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Amritsar",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Varanasi",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Asansol",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhilai",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bhopal",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Madurai",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Coimbatore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Delhi",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Hyderabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Pune",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Nagpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Jaipur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kanpur",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Patna",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Chennai",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Ahmedabad",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Surat",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "New Delhi",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Bangalore",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Mumbai",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Kolkata",
      "timezone": "Asia/Kolkata"
    },
    {
      "city": "Binjai",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Padangsidempuan",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tarutung",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tebingtinggi",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tidore",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Bukittinggi",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Sawahlunto",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Padangpanjang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Amahai",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Mataram",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Praya",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Baubau",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Luwuk",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Poso",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Biak",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Timika",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Langsa",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Indramayu",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Sukabumi",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Cilacap",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Pati",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Pakalongan",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tegal",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Salatiga",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Magelang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Serang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Bekasi",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Singkawang",
      "timezone": "Asia/Pontianak"
    },
    {
      "city": "Bandar Lampung",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Perabumulih",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Kuta",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Singaraja",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Sumenep",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Banyuwangi",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tuban",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Probolinggo",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Pasuruan",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Mojokerto",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Madiun",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Kediri",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Blitar",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Waingapu",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Maumere",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Ende",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Makale",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Palopo",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Watampone",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Pinrang",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Majene",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Tanjungpinang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Telukbutun",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Sungaipenuh",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Sampit",
      "timezone": "Asia/Pontianak"
    },
    {
      "city": "Kualakapuas",
      "timezone": "Asia/Pontianak"
    },
    {
      "city": "Palangkaraya",
      "timezone": "Asia/Pontianak"
    },
    {
      "city": "Bontang",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Denpasar",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Sorong",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Sibolga",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Pematangsiantar",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Pekanbaru",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Manado",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Yogyakarta",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Kendari",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Palu",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Nabire",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Merauke",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Lhokseumawe",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Samarinda",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Cirebon",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tasikmalaya",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Bogor",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Bengkulu",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Pontianak",
      "timezone": "Asia/Pontianak"
    },
    {
      "city": "Kotabumi",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Lahat",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Pangkalpinang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Jember",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Martapura",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Ruteng",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Jambi",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Manokwari",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Ternate",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Ambon",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Raba",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Jayapura",
      "timezone": "Asia/Jayapura"
    },
    {
      "city": "Banda Aceh",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Balikpapan",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Surakarta",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Bandar Lampung",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tanjungpandan",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Malang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Kupang",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Parepare",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Gorontalo",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Padang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Tarakan",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Semarang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Palembang",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Bandjarmasin",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Ujungpandang",
      "timezone": "Asia/Makassar"
    },
    {
      "city": "Medan",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Bandung",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Surabaya",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Jakarta",
      "timezone": "Asia/Jakarta"
    },
    {
      "city": "Yasuj",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Shar e Kord",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Marv Dasht",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Shahrud",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Varamin",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Masjed Soleyman",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Borujerd",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Malayer",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Zanjan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Urmia",
      "timezone": null
    },
    {
      "city": "Ahar",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Sanandaj",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Neyshabur",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Bojnurd",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Sirjan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Qomsheh",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Kashan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Khomeini Shahr",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Fasa",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Gonbad-e Kavus",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Gorgan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Amol",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Sari",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Semnan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Karaj",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Behbehan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Dezful",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Khorramabad",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Ilam",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Saveh",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Arak",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Mahabad",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Khvoy",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Maragheh",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Qasr-e Shirin",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Bijar",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Yazdan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Torbat-e Jam",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Quchan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Chabahar",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Kashmar",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Bam",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Kerman",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Bandar-e Bushehr",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Abadan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Ardabil",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Qom",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Qazvin",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Kermanshah",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Rasht",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Birjand",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Sabzewar",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Zabol",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Zahedan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Yazd",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Ahvaz",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Bandar-e-Abbas",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Hamadan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Tabriz",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Isfahan",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Shiraz",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Mashhad",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Tehran",
      "timezone": "Asia/Tehran"
    },
    {
      "city": "Dahuk",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Samarra",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Az Aubayr",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Ad Diwaniyah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Ash Shatrah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Mandali",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Ar Ramadi",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Al Musayyib",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Zakho",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Tall Afar",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Tikrit",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Karbala",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "As Samawah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "An Nasiriyah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Al Amarah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Al Kut",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "As Sulaymaniyah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Baqubah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Ar Rutbah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Al Fallujah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Al Hillah",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Irbil",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Kirkuk",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Mosul",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "An Najaf",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Basra",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Baghdad",
      "timezone": "Asia/Baghdad"
    },
    {
      "city": "Ros Comain",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Muineachan",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Shannon",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Waterford",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Tralee",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Donegal",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Drogheda",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Dundalk",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Galway",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Kilkenny",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Killarney",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Sligo",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Cork",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Limerick",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Dublin",
      "timezone": "Europe/Dublin"
    },
    {
      "city": "Douglas",
      "timezone": "Europe/Isle_of_Man"
    },
    {
      "city": "Ramla",
      "timezone": "Asia/Jerusalem"
    },
    {
      "city": "Beer Sheva",
      "timezone": "Asia/Jerusalem"
    },
    {
      "city": "Haifa",
      "timezone": "Asia/Jerusalem"
    },
    {
      "city": "Nazareth",
      "timezone": "Asia/Jerusalem"
    },
    {
      "city": "Jerusalem",
      "timezone": "Asia/Jerusalem"
    },
    {
      "city": "Tel Aviv-Yafo",
      "timezone": "Asia/Jerusalem"
    },
    {
      "city": "Potenza",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Campobasso",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Aosta",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Modena",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Crotone",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Vibo Valentia",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Reggio di Calabria",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Caserta",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Barletta",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Ragusa",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Asti",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Novara",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Como",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Udine",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Treviso",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Parma",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Ravenna",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Ferrara",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Bologna",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Olbia",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Cagliari",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Pisa",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Livorno",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Siena",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Arezzo",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Catanzaro",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Salerno",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Benevento",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Bari",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Foggia",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Lecce",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Brindisi",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Taranto",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Messina",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Marsala",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Siracusa",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Pescara",
      "timezone": "Europe/Rome"
    },
    {
      "city": "L'Aquila",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Civitavecchia",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Ancona",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Perugia",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Bergamo",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Trieste",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Bolzano",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Trento",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Verona",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Sassari",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Turin",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Genoa",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Florence",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Catania",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Venice",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Palermo",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Naples",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Milan",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Rome",
      "timezone": "Europe/Rome"
    },
    {
      "city": "Touba",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Bouafle",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Divo",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Toumodi",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Aboisso",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Ferkessedougou",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Odienne",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Man",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Seguela",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Gagnoa",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Soubre",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "San-Pedro",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Sassandra",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Bondoukou",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Agboville",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Dimbokro",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Grand Bassam",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Dabou",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Guiglo",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Abengourou",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Korhogo",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Daloa",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Bouake",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Yamoussoukro",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Abidjan",
      "timezone": "Africa/Abidjan"
    },
    {
      "city": "Lucea",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Mandeville",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Black River",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Falmouth",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Savanna-la-Mar",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Port Antonio",
      "timezone": "America/Jamaica"
    },
    {
      "city": "St. Ann's Bay",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Port Maria",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Half Way Tree",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Port Morant",
      "timezone": "America/Jamaica"
    },
    {
      "city": "May Pen",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Spanish Town",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Montego Bay",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Kingston",
      "timezone": "America/Jamaica"
    },
    {
      "city": "Okayama",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Shimonoseki",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kanoya",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Takamatsu",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Tokushima",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Toyama",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Takaoka",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Otsu",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Maebashi",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kawasaki",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kawagoe",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Utsunomiya",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Hachioji",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Koriyama",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kure",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Matsue",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Tottori",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Sasebo",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kitakyushu",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kumamoto",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Oita",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Gifu",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Tsu",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Matsumoto",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Shizuoka",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Hamamatsu",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Obihiro",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Tomakomai",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kitami",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Otaru",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Fukui",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Maizuru",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Wakayama",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Mito",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kofu",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Iwaki",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Nagaoka",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Yamagata",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Tsuruoka",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kagoshima",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Matsuyama",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kanazawa",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Muroran",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Asahikawa",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kobe",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Yokohama",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Akita",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Aomori",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Hirosaki",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Hachinohe",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Fukushima",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Morioka",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Niigata",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Fukuoka",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Miyazaki",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Naha",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kochi",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Nagoya",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Nagano",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kushiro",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Hakodate",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Kyoto",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Sendai",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Sakata",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Nagasaki",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Hiroshima",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Sapporo",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Osaka",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Tokyo",
      "timezone": "Asia/Tokyo"
    },
    {
      "city": "Al Mafraq",
      "timezone": "Asia/Amman"
    },
    {
      "city": "At Tafilah",
      "timezone": "Asia/Amman"
    },
    {
      "city": "Ma'an",
      "timezone": "Asia/Amman"
    },
    {
      "city": "Irbid",
      "timezone": "Asia/Amman"
    },
    {
      "city": "As Salt",
      "timezone": "Asia/Amman"
    },
    {
      "city": "Az Zarqa",
      "timezone": "Asia/Amman"
    },
    {
      "city": "Al Aqabah",
      "timezone": "Asia/Amman"
    },
    {
      "city": "Al Karak",
      "timezone": "Asia/Amman"
    },
    {
      "city": "Amman",
      "timezone": "Asia/Amman"
    },
    {
      "city": "Turgay",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Mangyshlak",
      "timezone": "Asia/Aqtau"
    },
    {
      "city": "Maqat",
      "timezone": "Asia/Atyrau"
    },
    {
      "city": "Bestobe",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Osakarovka",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Aqadyr",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Sharbaqty",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Shemonaikha",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Serebryansk",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Boralday",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Zharkent",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Esik",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Lenger",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Kentau",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Zhosaly",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Oktyabrsk",
      "timezone": "Asia/Aqtobe"
    },
    {
      "city": "Algha",
      "timezone": "Asia/Aqtobe"
    },
    {
      "city": "Bayghanin",
      "timezone": "Asia/Aqtobe"
    },
    {
      "city": "Embi",
      "timezone": "Asia/Aqtobe"
    },
    {
      "city": "Zhetiqara",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Komsomolets",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Tobol",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Qusmuryn",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Shieli",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Makhambet",
      "timezone": "Asia/Atyrau"
    },
    {
      "city": "Chapaev",
      "timezone": "Asia/Oral"
    },
    {
      "city": "Zhanibek",
      "timezone": "Asia/Oral"
    },
    {
      "city": "Aqsay",
      "timezone": "Asia/Oral"
    },
    {
      "city": "Esil",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Derzhavinsk",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Zhaltyr",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Makinsk",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Aqsu",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Zholymbet",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Erymentau",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Saryshaghan",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Qarazhal",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Atasu",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Kishkenekol",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Tayynsha",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Bulaevo",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Ertis",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Kachiry",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Zaysan",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Zyryanovsk",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Ridder",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Shar",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Urzhar",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Sarqan",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Ushtobe",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Shonzhy",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Qapshaghay",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Otar",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Fort Shevchenko",
      "timezone": "Asia/Aqtau"
    },
    {
      "city": "Zhangaozen",
      "timezone": "Asia/Aqtau"
    },
    {
      "city": "Arys",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Burylbaytal",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Shu",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Qulan",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Oytal",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Qaratau",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Khromtau",
      "timezone": "Asia/Aqtobe"
    },
    {
      "city": "Arqalyq",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Oostanay",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Baykonur",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Balyqshy",
      "timezone": "Asia/Atyrau"
    },
    {
      "city": "Atbasar",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Kokshetau",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Temirtau",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Zhezqazghan",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Qarqaraly",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Balqash",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Petropavlovsk",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Ayakoz",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Taldyqorghan",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Turkistan",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Shalqar",
      "timezone": "Asia/Aqtobe"
    },
    {
      "city": "Qazaly",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Aral",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Qulsary",
      "timezone": "Asia/Atyrau"
    },
    {
      "city": "Oral",
      "timezone": "Asia/Oral"
    },
    {
      "city": "Beyneu",
      "timezone": "Asia/Aqtau"
    },
    {
      "city": "Aktau",
      "timezone": "Asia/Aqtau"
    },
    {
      "city": "Aktobe",
      "timezone": "Asia/Aqtobe"
    },
    {
      "city": "Rudny",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Qyzylorda",
      "timezone": "Asia/Qyzylorda"
    },
    {
      "city": "Atyrau",
      "timezone": "Asia/Atyrau"
    },
    {
      "city": "Ekibastuz",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Pavlodar",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Semey",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Oskemen",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Shymkent",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Taraz",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Astana",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Qaraghandy",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Almaty",
      "timezone": "Asia/Almaty"
    },
    {
      "city": "Nyeri",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Mwingi",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Embu",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Machakos",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Nanyuki",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Maralal",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Konza",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Lodwar",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Eldama Ravine",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Sotik",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Namanga",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Naivasha",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Kericho",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Kitale",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Bungoma",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Kakamega",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Wajir",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Garissa",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Witu",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Tsavo",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Voi",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Kilifi",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Thika",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Kendu Bay",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Karungu",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Kisii",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Marsabit",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Moyale",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Nakuru",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Lamu",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Malindi",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Kisumu",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Meru",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Eldoret",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Mombasa",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Nairobi",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Tarawa",
      "timezone": "Pacific/Tarawa"
    },
    {
      "city": "Prizren",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Pec",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Pristina",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Hawalli",
      "timezone": "Asia/Kuwait"
    },
    {
      "city": "Al Ahmadi",
      "timezone": "Asia/Kuwait"
    },
    {
      "city": "Al Jahra",
      "timezone": "Asia/Kuwait"
    },
    {
      "city": "Kuwait",
      "timezone": "Asia/Kuwait"
    },
    {
      "city": "Tokmak",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Kara Balta",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Cholpon Ata",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Naryn",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Kok Yangak",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Balykchy",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "At Bashy",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Jalal Abad",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Toktogul",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Tash Komur",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Talas",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Osh",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Karakol",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Bishkek",
      "timezone": "Asia/Bishkek"
    },
    {
      "city": "Ban Houayxay",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Louang Namtha",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Champasak",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Saravan",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Xam Nua",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Phongsali",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Attapu",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Xaignabouri",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Pakxe",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Xiangkhoang",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Louangphrabang",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Thakhek",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Savannakhet",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Vientiane",
      "timezone": "Asia/Vientiane"
    },
    {
      "city": "Rezekne",
      "timezone": "Europe/Riga"
    },
    {
      "city": "Ventspils",
      "timezone": "Europe/Riga"
    },
    {
      "city": "Jelgava",
      "timezone": "Europe/Riga"
    },
    {
      "city": "Liepaga",
      "timezone": "Europe/Riga"
    },
    {
      "city": "Daugavpils",
      "timezone": "Europe/Riga"
    },
    {
      "city": "Riga",
      "timezone": "Europe/Riga"
    },
    {
      "city": "B'abda",
      "timezone": "Asia/Beirut"
    },
    {
      "city": "Nabatiye et Tahta",
      "timezone": "Asia/Beirut"
    },
    {
      "city": "Saida",
      "timezone": "Asia/Beirut"
    },
    {
      "city": "Zahle",
      "timezone": "Asia/Beirut"
    },
    {
      "city": "Trablous",
      "timezone": "Asia/Beirut"
    },
    {
      "city": "Beirut",
      "timezone": "Asia/Beirut"
    },
    {
      "city": "Teyateyaneng",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Mohales Hoek",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Moyeni",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Hlotse",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Butha-Buthe",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Mokhotlong",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Mafetang",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Maseru",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Barclayville",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Voinjama",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Bensonville",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Kakata",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Sanniquellie",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Rivercess",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Harper",
      "state_ansi": "MD",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Gbarnga",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Zwedru",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Greenville",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Buchanan",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Robertsport",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Monrovia",
      "timezone": "Africa/Monrovia"
    },
    {
      "city": "Dirj",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Nalut",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Zillah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Al Khums",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Tajarhi",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Umm al Abid",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Az Zawiyah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Gharyan",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Mizdah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Bani Walid",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Al Marj",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Al Bayda",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Shahhat",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "El Agheila",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Maradah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Qaminis",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "As Sidr",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Al Jaghbub",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Ghadamis",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Hun",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Birak",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Ghat",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Marzuq",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Ajdabiya",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Awjilah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Surt",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Darnah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Tubruq",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Al Jawf",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Tmassah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Misratah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Zuwarah",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Sabha",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Banghazi",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Tripoli",
      "timezone": "Africa/Tripoli"
    },
    {
      "city": "Vaduz",
      "timezone": "Europe/Vaduz"
    },
    {
      "city": "Panevežys",
      "timezone": "Europe/Vilnius"
    },
    {
      "city": "Siauliai",
      "timezone": "Europe/Vilnius"
    },
    {
      "city": "Klaipeda",
      "timezone": "Europe/Vilnius"
    },
    {
      "city": "Kaunas",
      "timezone": "Europe/Vilnius"
    },
    {
      "city": "Vilnius",
      "timezone": "Europe/Vilnius"
    },
    {
      "city": "Diekirch",
      "timezone": "Europe/Luxembourg"
    },
    {
      "city": "Grevenmacher",
      "timezone": "Europe/Luxembourg"
    },
    {
      "city": "Luxembourg",
      "timezone": "Europe/Luxembourg"
    },
    {
      "city": "Macau",
      "timezone": "Asia/Macau"
    },
    {
      "city": "Tetovo",
      "timezone": "Europe/Skopje"
    },
    {
      "city": "Bitola",
      "timezone": "Europe/Skopje"
    },
    {
      "city": "Skopje",
      "timezone": "Europe/Skopje"
    },
    {
      "city": "Sambava",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Ambanja",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Ihosy",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Mandritsara",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Besalampy",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Marovoay",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Antsohihy",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Ambatondrazaka",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Bekiy",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Manja",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Miandrivazo",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Antsirabe",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Antalaha",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Andoany",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Farafangana",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Mananjary",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Maintirano",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Toamasina",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Maroantsetra",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Tolanaro",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Morombe",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Androka",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Morondava",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Antsiranana",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Fianarantsoa",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Mahajanga",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Toliara",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Antananarivo",
      "timezone": "Indian/Antananarivo"
    },
    {
      "city": "Mzimba",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Machinga",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Dedza",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Mchinji",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Ntcheu",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Chiradzulu",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Nsanje",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Mwanza",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Mulanje",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Karonga",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Chitipa",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Nkhata Bay",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Nkhotakota",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Mangochi",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Salima",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Chiromo",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Zomba",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Mzuzu",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Blantyre",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Lilongwe",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Kangar",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Kuala Lipis",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Shah Alam",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Teluk Intan",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Butterworth",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Sungai Petani",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Alor Setar",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Muar",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Batu Pahat",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Keluang",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Seremban",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Raub",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Chukai",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Kuala Terengganu",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Lahad Datu",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "Bintulu",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "Miri",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "Johor Bahru",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Kelang",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Taiping",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Ipoh",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Kota Baharu",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Malacca",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Kuantan",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Tawau",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "Sandakan",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "Kota Kinabalu",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "Sibu",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "George Town",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Kuching",
      "timezone": "Asia/Kuching"
    },
    {
      "city": "Putrajaya",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Kuala Lumpur",
      "timezone": "Asia/Kuala_Lumpur"
    },
    {
      "city": "Male",
      "timezone": "Indian/Maldives"
    },
    {
      "city": "Goundam",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Aguelhok",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Bourem",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Kati",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Banamba",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Kangaba",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Nioro du Sahel",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Bafoulabe",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Satadougou",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Yelimane",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Kita",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Koutiala",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Sikasso",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Bougouni",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Markala",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Sokolo",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "San",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Taoudenni",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Araouane",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Tessalit",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Menaka",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Nara",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Koulikoro",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Mopti",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Gao",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Kayes",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Segou",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Timbuktu",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Bamako",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Djenne",
      "timezone": "Africa/Bamako"
    },
    {
      "city": "Valletta",
      "timezone": "Europe/Malta"
    },
    {
      "city": "Majuro",
      "timezone": "Pacific/Majuro"
    },
    {
      "city": "Fderik",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Aleg",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Akjoujt",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Zouirat",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Chegga",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Magta Lajar",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Bogue",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Boutilimit",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Selibaby",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Timbedra",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Nema",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Saint-Louis",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Tidjikdja",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Bir Mogrein",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Rosso",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Kiffa",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Nouadhibou",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Ayoun el Atrous",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Nouakchott",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Atar",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Curepipe",
      "timezone": "Indian/Mauritius"
    },
    {
      "city": "Port Louis",
      "timezone": "Indian/Mauritius"
    },
    {
      "city": "Vicente Guerrero",
      "timezone": "America/Tijuana"
    },
    {
      "city": "Loreto",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Ciudad Constitucion",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Allende",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Nueva Rosita",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Hidalgo del Parral",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Ascension",
      "timezone": "America/Ojinaga"
    },
    {
      "city": "Gomez Palacio",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Canatlan",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Villa Union",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Altata",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Esperanza",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Magdalena",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Nacozari Viejo",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Villanueva",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Montemorelos",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Sabinas Hidalgo",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Cardenas",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Ciudad Valles",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Rio Verde",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Ciudad Mante",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Reynosa",
      "timezone": "America/Matamoros"
    },
    {
      "city": "Ciudad Madero",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Autlan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Ciudad Hidalgo",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Apatzingan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Santiago Ixcuintla",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Juchitan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Miahuatlan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Atlixco",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Acatlan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Paraiso",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Balancan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tlaxcala",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Irapuato",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Celaya",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Chilpancingo",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Iguala",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tecpan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Atoyac",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Nezahualcoyotl",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "San Juan del Rio",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Jaltipan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Orizaba",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Xalapa",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Nautla",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "San Cristobal de Las Casas",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Escuintla",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Motul",
      "timezone": "America/Merida"
    },
    {
      "city": "Tekax",
      "timezone": "America/Merida"
    },
    {
      "city": "Peto",
      "timezone": "America/Merida"
    },
    {
      "city": "Halacho",
      "timezone": "America/Merida"
    },
    {
      "city": "San Quintin",
      "timezone": "America/Tijuana"
    },
    {
      "city": "Punta Prieta",
      "timezone": "America/Tijuana"
    },
    {
      "city": "San Felipe",
      "timezone": "America/Tijuana"
    },
    {
      "city": "Santa Rosalia",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Guerrero Negro",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Piedras Negras",
      "timezone": "America/Matamoros"
    },
    {
      "city": "San Pedro de las Colonias",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Sierra Mojada",
      "timezone": "America/Matamoros"
    },
    {
      "city": "Parras",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Cuauhtemoc",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Nuevo Casas Grandes",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Ojinaga",
      "timezone": "America/Ojinaga"
    },
    {
      "city": "Villa Ahumada",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Santa Barbara",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Ciudad Camargo",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Cuencame",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Papasquiaro",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Escuinapa",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Guamuchil",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Guasave",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "El Fuerte",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Eldorado",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "La Cruz",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Agua Prieta",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Ciudad Obregon",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Navajoa",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Caborca",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Mazatlán",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Cananea",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Huatabampo",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Zacatecas",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Juan Aldama",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Valparaiso",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Fresnillo",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Linares",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Matehuala",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tamuin",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tamazunchale",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tula",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Aldama",
      "timezone": "America/Monterrey"
    },
    {
      "city": "San Fernando",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Tecoman",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Puerto Vallarta",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "La Barca",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Ciudad Guzman",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Lagos de Moreno",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Morelia",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Lazaro Cardenas",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Zamora",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Coalcoman",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Uruapan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tuxpan",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Tepic",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Compostela",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Tecuala",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Ciudad del Carmen",
      "timezone": "America/Merida"
    },
    {
      "city": "Champoton",
      "timezone": "America/Merida"
    },
    {
      "city": "Salina Cruz",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Puerto Escondido",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Pochutla",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Mitla",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tlaxiaco",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Huajuapan de Leon",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tehuacan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Teziutlan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Frontera",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tenosique",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Salamanca",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Guanajuato",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Taxco",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Ayutla",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Ciudad Altamirano",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Petatlan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Pachuca",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Toluca",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Zumpango",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Minatitlan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Coatzacoalcos",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Poza Rica de Hidalgo",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Cordoba",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Santiago Tuxtla",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tuxpam",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Panuco",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Pijijiapan",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Isla Mujeres",
      "timezone": "America/Cancun"
    },
    {
      "city": "Felipe Carrillo Puerto",
      "timezone": "America/Cancun"
    },
    {
      "city": "Tizimin",
      "timezone": "America/Merida"
    },
    {
      "city": "Valladolid",
      "timezone": "America/Merida"
    },
    {
      "city": "Izamal",
      "timezone": "America/Merida"
    },
    {
      "city": "Ticul",
      "timezone": "America/Merida"
    },
    {
      "city": "Ensenada",
      "timezone": "America/Tijuana"
    },
    {
      "city": "Saltillo",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Ciudad Juárez",
      "timezone": "America/Ojinaga"
    },
    {
      "city": "Delicias",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Durango",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Los Mochis",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Ciudad Victoria",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Aguascalientes",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Manzanillo",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tehuantepec",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Villahermosa",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Cuernavaca",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Queretaro",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tapachula",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Chetumal",
      "timezone": "America/Cancun"
    },
    {
      "city": "Progreso",
      "timezone": "America/Merida"
    },
    {
      "city": "Cabo San Lucas",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Monclova",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Ometepec",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Cozumel",
      "timezone": "America/Cancun"
    },
    {
      "city": "Mexicali",
      "timezone": "America/Tijuana"
    },
    {
      "city": "La Paz",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Torreon",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Culiacan",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Nogales",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Hermosillo",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "Guaymas",
      "timezone": "America/Hermosillo"
    },
    {
      "city": "San Luis Potosi",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Matamoros",
      "timezone": "America/Matamoros"
    },
    {
      "city": "Nuevo Laredo",
      "timezone": "America/Matamoros"
    },
    {
      "city": "Colima",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Campeche",
      "timezone": "America/Merida"
    },
    {
      "city": "Oaxaca",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Leon",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tijuana",
      "timezone": "America/Tijuana"
    },
    {
      "city": "Chihuahua",
      "timezone": "America/Chihuahua"
    },
    {
      "city": "Mazatlan",
      "timezone": "America/Mazatlan"
    },
    {
      "city": "Tampico",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Acapulco",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Veracruz",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Tuxtla Gutierrez",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Cancun",
      "timezone": "America/Cancun"
    },
    {
      "city": "Merida",
      "timezone": "America/Merida"
    },
    {
      "city": "Guadalajara",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Puebla",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Monterrey",
      "timezone": "America/Monterrey"
    },
    {
      "city": "Mexico City",
      "timezone": "America/Mexico_City"
    },
    {
      "city": "Dubasari",
      "timezone": "Europe/Chisinau"
    },
    {
      "city": "Balti",
      "timezone": "Europe/Chisinau"
    },
    {
      "city": "Cahul",
      "timezone": "Europe/Chisinau"
    },
    {
      "city": "Tiraspol",
      "timezone": "Europe/Chisinau"
    },
    {
      "city": "Chisinau",
      "timezone": "Europe/Chisinau"
    },
    {
      "city": "Monaco",
      "timezone": "Europe/Paris"
    },
    {
      "city": "Suchboatar",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Dzuunmod",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Tsetserleg",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Olgiy",
      "timezone": "Asia/Hovd"
    },
    {
      "city": "Ulaan-Uul",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Hodrogo",
      "timezone": "Asia/Hovd"
    },
    {
      "city": "Buyant-Uhaa",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Ondorhaan",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Bayankhongor",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Uliastay",
      "timezone": "Asia/Hovd"
    },
    {
      "city": "Altay",
      "timezone": "Asia/Hovd"
    },
    {
      "city": "Moron",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Ulaangom",
      "timezone": "Asia/Hovd"
    },
    {
      "city": "Bulgan",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Mandalgovi",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Darhan",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Dzuunharaa",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Arvayheer",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Baruun Urt",
      "timezone": "Asia/Choibalsan"
    },
    {
      "city": "Dalandzadgad",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Dund-Us",
      "timezone": "Asia/Hovd"
    },
    {
      "city": "Choybalsan",
      "timezone": "Asia/Choibalsan"
    },
    {
      "city": "Erdenet",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Ulaanbaatar",
      "timezone": "Asia/Ulaanbaatar"
    },
    {
      "city": "Podgorica",
      "timezone": "Europe/Podgorica"
    },
    {
      "city": "Ksar El Kebir",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Larache",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Taza",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Ouezzane",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Kenitra",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Settat",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Er Rachidia",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Meknes",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Tiznit",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "El Jadida",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Dawra",
      "timezone": "Africa/El_Aaiun"
    },
    {
      "city": "Lemsid",
      "timezone": "Africa/El_Aaiun"
    },
    {
      "city": "Tan Tan",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Bir Anzarane",
      "timezone": "Africa/El_Aaiun"
    },
    {
      "city": "Tangier",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Agadir",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Goulimine",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Smara",
      "timezone": "Africa/El_Aaiun"
    },
    {
      "city": "Ad Dakhla",
      "timezone": "Africa/El_Aaiun"
    },
    {
      "city": "Oujda",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Safi",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Laayoune",
      "timezone": "Africa/El_Aaiun"
    },
    {
      "city": "Fez",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Rabat",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Marrakesh",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Casablanca",
      "timezone": "Africa/Casablanca"
    },
    {
      "city": "Moatize",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Luangwa",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Manica",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Espungabera",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Montepuez",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Mocimboa",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Marrupa",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Cuamba",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Ligonha",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Macia",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Massangena",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Mapai",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Dondo",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Chiramba",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Mocuba",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Nicuadala",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Maxixe",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Panda",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Quissico",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Vilanculos",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Matola",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Chimoio",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Lichinga",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Angoche",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Mocambique",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Inhambane",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Tete",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Pemba",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Nampula",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Xai-Xai",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Quelimane",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Nacala",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Beira",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Maputo",
      "timezone": "Africa/Maputo"
    },
    {
      "city": "Loikaw",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Pa-an",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Hakha",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Taunggyi",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Sagaing",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Myingyan",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Letpadan",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Taungoo",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Thongwa",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Mudon",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Ye",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Mawlamyine",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Kyaukphyu",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Wakema",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Labutta",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Phyarpon",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Yandoon",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Hinthada",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Pathein",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Allanmyo",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Yaynangyoung",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Chauk",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Pakokku",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Namtu",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Dawei",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Shwebo",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Bago",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Pyu",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Pyay",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Magway",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Myitkyina",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Monywa",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Myeik",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Mandalay",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Sittwe",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Naypyidaw",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Rangoon",
      "timezone": "Asia/Rangoon"
    },
    {
      "city": "Omaruru",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Karibib",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Otavi",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Gobabis",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Karasburg",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Bethanie",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Oranjemund",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Mariental",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Rehoboth",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Outjo",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Opuwo",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Usakos",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Okahandja",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Otjiwarongo",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Oshikango",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Cuangar",
      "timezone": "Africa/Luanda"
    },
    {
      "city": "Katima Mulilo",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Keetmanshoop",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Maltahöhe",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Swakopmund",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Ongwediva",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Rundu",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Tsumeb",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Lüderitz",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Walvis Bay",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Windhoek",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Grootfontein",
      "timezone": "Africa/Windhoek"
    },
    {
      "city": "Salyan",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Baglung",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Jumla",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Bhairawa",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Dandeldhura",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Dhangarhi",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Ramechhap",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Bhimphedi",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Rajbiraj",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Ilam",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Lalitpur",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Hetauda",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Nepalganj",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Birganj",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Biratnagar",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Pokhara",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Kathmandu",
      "timezone": "Asia/Kathmandu"
    },
    {
      "city": "Assen",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Arnhem",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Maastricht",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Zwolle",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Middelburg",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "'s-Hertogenbosch",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Eindhoven",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Leeuwarden",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Groningen",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Utrecht",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Haarlem",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Rotterdam",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "The Hague",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Amsterdam",
      "timezone": "Europe/Amsterdam"
    },
    {
      "city": "Noumea",
      "timezone": "Pacific/Noumea"
    },
    {
      "city": "Greymouth",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Upper Hutt",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Masterton",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Levin",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Waitakere",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Takapuna",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Whakatane",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Ashburton",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Kaiapoi",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "New Plymouth",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Westport",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Hokitika",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Oamaru",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Palmerston North",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Wanganui",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Hastings",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Gisborne",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Rotorua",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Taupo",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Tauranga",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Timaru",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Nelson",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Whangarei",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Queenstown",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Invercargill",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Napier",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Manukau",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Hamilton",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Blenheim",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Dunedin",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Wellington",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Christchurch",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Auckland",
      "timezone": "Pacific/Auckland"
    },
    {
      "city": "Somoto",
      "timezone": "America/Managua"
    },
    {
      "city": "Ocotal",
      "timezone": "America/Managua"
    },
    {
      "city": "San Carlos",
      "timezone": "America/Managua"
    },
    {
      "city": "Jinotepe",
      "timezone": "America/Managua"
    },
    {
      "city": "Jinotega",
      "timezone": "America/Managua"
    },
    {
      "city": "Masaya",
      "timezone": "America/Managua"
    },
    {
      "city": "San Juan del Sur",
      "timezone": null
    },
    {
      "city": "Esteli",
      "timezone": "America/Managua"
    },
    {
      "city": "Boaco",
      "timezone": "America/Managua"
    },
    {
      "city": "Juigalpa",
      "timezone": "America/Managua"
    },
    {
      "city": "Rivas",
      "timezone": "America/Managua"
    },
    {
      "city": "San Juan de Nicaragua",
      "timezone": "America/Managua"
    },
    {
      "city": "Granada",
      "timezone": "America/Managua"
    },
    {
      "city": "Chinandega",
      "timezone": "America/Managua"
    },
    {
      "city": "Matagalpa",
      "timezone": "America/Managua"
    },
    {
      "city": "Puerto Cabezas",
      "timezone": "America/Managua"
    },
    {
      "city": "Leon",
      "timezone": "America/Managua"
    },
    {
      "city": "Bluefields",
      "timezone": "America/Managua"
    },
    {
      "city": "Managua",
      "timezone": "America/Managua"
    },
    {
      "city": "Goure",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Gaya",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Tillaberi",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Ayorou",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Birni Nkonni",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Madaoua",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Diffa",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Nguigmi",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Dosso",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Arlit",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Djado",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Maradi",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Tahoua",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Zinder",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Niamey",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Agadez",
      "timezone": "Africa/Niamey"
    },
    {
      "city": "Umuahia",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Uyo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Owerri",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Dutse",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Damaturu",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Iwo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Iseyin",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Biu",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Bama",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Aba",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Opobo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Orlu",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Oturkpo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Calabar",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Wukari",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Jalingo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Kontagora",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Bida",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Abeokuta",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ijebu Ode",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Akure",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ikare",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Owo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ondo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ado Ekiti",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ife",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Oshogbo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Oyo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Awka",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Onitsha",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Azare",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Bauchi",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Gombe",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Kumo",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Sapele",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Nsukka",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Lokoja",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Idah",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Lafia",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Keffi",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Funtua",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Katsina",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Gusau",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Nguru",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Gashua",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Potiskum",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Birnin Kebbi",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Koko",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Mubi",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Numan",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ilorin",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Minna",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Zaria",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Jos",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Yola",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Benin City",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Maiduguri",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Port Harcourt",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Makurdi",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ibadan",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Ogbomosho",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Warri",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Kaduna",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Enugu",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Sokoto",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Abuja",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Kano",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Lagos",
      "timezone": "Africa/Lagos"
    },
    {
      "city": "Sariwon",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Sin-Ni",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Changyon",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Anbyon",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Munchon",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Kaesong",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Chosan",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Manpo",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Sunchon",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Kimhyonggwon",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Pyongsan",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Ongjin",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Haeju",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Kilchu",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Musan",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Sonbong",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Kanggye",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Hungnam",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Taedong",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Chongju",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Hyeson",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Nampo",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Chongjin",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Kimchaek",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Hamhung",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Wonsan",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Sinuiju",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Pyongyang",
      "timezone": "Asia/Pyongyang"
    },
    {
      "city": "Kyrenia",
      "timezone": "Asia/Famagusta"
    },
    {
      "city": "Ammochostos",
      "timezone": "Asia/Famagusta"
    },
    {
      "city": "Capitol Hill",
      "timezone": "Pacific/Saipan"
    },
    {
      "city": "Arendal",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Vossavangen",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Leikanger",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Bærum",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Hamar",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Tønsberg",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Finnsnes",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Gjøvik",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Rørvik",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Harstad",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Ålesund",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Sandnes",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Drammen",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Moss",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Steinkjer",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Svolvær",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Mo i Rana",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Narvik",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Bodø",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Haugesund",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Stavanger",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Skien",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Namsos",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Alta",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Vadsø",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Molde",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Lillehammer",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Kirkenes",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Kristiansand",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Hammerfest",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Tromsø",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Trondheim",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Bergen",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Oslo",
      "timezone": "Europe/Oslo"
    },
    {
      "city": "Alayat Samail",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Dawwah",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Mirbat",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Ibri",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Salalah",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Suhar",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "As Sib",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Nizwa",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Sur",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Muscat",
      "timezone": "Asia/Muscat"
    },
    {
      "city": "Parachinar",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Sialkote",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Sheikhu Pura",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Gujrat",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Sahiwal",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Chiniot",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Rahim Yar Khan",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Mansehra",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Kohat",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Abbottabad",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Mardan",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Gwadar",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Zhob",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Gilgit",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Kasur",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Kundian",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Okara",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Jhang",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Sargodha",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Dera Ghazi Khan",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Sadiqabad",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Nawabshah",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Bannu",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Dera Ismail Khan",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Chaman",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Turbat",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Faisalabad",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Rawalpindi",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Bahawalpur",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Mirput Khas",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Sukkur",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Saidu",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Gujranwala",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Quetta",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Larkana",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Islamabad",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Multan",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Hyderabad",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Peshawar",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Lahore",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Karachi",
      "timezone": "Asia/Karachi"
    },
    {
      "city": "Koror",
      "timezone": "Pacific/Palau"
    },
    {
      "city": "Melekeok",
      "timezone": "Pacific/Palau"
    },
    {
      "city": "Ramallah",
      "timezone": "Asia/Hebron"
    },
    {
      "city": "Al Khalil",
      "timezone": "Asia/Hebron"
    },
    {
      "city": "Nablus",
      "timezone": "Asia/Hebron"
    },
    {
      "city": "Gaza",
      "timezone": "Asia/Gaza"
    },
    {
      "city": "El Porvenir",
      "timezone": "America/Panama"
    },
    {
      "city": "Penonome",
      "timezone": "America/Panama"
    },
    {
      "city": "Chitre",
      "timezone": "America/Panama"
    },
    {
      "city": "Jaque",
      "timezone": "America/Panama"
    },
    {
      "city": "Bocas del Toro",
      "timezone": "America/Panama"
    },
    {
      "city": "Almirante",
      "timezone": "America/Panama"
    },
    {
      "city": "Las Tablas",
      "timezone": "America/Panama"
    },
    {
      "city": "Santiago",
      "timezone": "America/Panama"
    },
    {
      "city": "La Palma",
      "timezone": "America/Panama"
    },
    {
      "city": "Colon",
      "timezone": "America/Panama"
    },
    {
      "city": "Balboa",
      "timezone": "America/Panama"
    },
    {
      "city": "Puerto Armuelles",
      "timezone": "America/Panama"
    },
    {
      "city": "David",
      "timezone": "America/Panama"
    },
    {
      "city": "Panama City",
      "timezone": "America/Panama"
    },
    {
      "city": "Wabag",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Vanimo",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Kundiawa",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Kerema",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Arawa",
      "timezone": "Pacific/Bougainville"
    },
    {
      "city": "Lorengau",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Kimbe",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Daru",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Sohano",
      "timezone": "Pacific/Bougainville"
    },
    {
      "city": "Kieta",
      "timezone": "Pacific/Bougainville"
    },
    {
      "city": "Mendi",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Abau",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Alotau",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Popondetta",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Hoskins",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Wewak",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Madang",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Kavieng",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Goroka",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Mt. Hagen",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Rabaul",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Lae",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Port Moresby",
      "timezone": "Pacific/Port_Moresby"
    },
    {
      "city": "Mariscal Estigarribia",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Caacupe",
      "timezone": "America/Asuncion"
    },
    {
      "city": "General Eugenio Alejandrino Garay",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Arroyos y Esteros",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Villa Hayes",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Fortin Falcon",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Puerto Pinasco",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Pozo Colorado",
      "timezone": "America/Asuncion"
    },
    {
      "city": "San Pedro",
      "timezone": "America/Asuncion"
    },
    {
      "city": "San Lorenzo",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Ypacarai",
      "timezone": "America/Asuncion"
    },
    {
      "city": "San Juan Bautista",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Paraguari",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Nacunday",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Coronel Oviedo",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Caazapa",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Ype Jhu",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Encarnacion",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Coronel Bogado",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Fuerte Olimpo",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Capitan Pablo Lagerenza",
      "timezone": "America/Asuncion"
    },
    {
      "city": "La Victoria",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Horqueta",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Belen",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Rosario",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Ita",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Pilar",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Pedro Juan Caballero",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Bella Vista",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Abai",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Ygatimi",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Hohenau",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Concepcion",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Villarrica",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Filadelfia",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Ciudad del Este",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Asuncion",
      "timezone": "America/Asuncion"
    },
    {
      "city": "Ferrenafe",
      "timezone": "America/Lima"
    },
    {
      "city": "Motupe",
      "timezone": "America/Lima"
    },
    {
      "city": "Mollendo",
      "timezone": "America/Lima"
    },
    {
      "city": "Urubamba",
      "timezone": "America/Lima"
    },
    {
      "city": "Santo Tomas",
      "timezone": "America/Lima"
    },
    {
      "city": "Putina",
      "timezone": "America/Lima"
    },
    {
      "city": "Casma",
      "timezone": "America/Lima"
    },
    {
      "city": "Tournavista",
      "timezone": "America/Lima"
    },
    {
      "city": "Huamachuco",
      "timezone": "America/Lima"
    },
    {
      "city": "Otuzco",
      "timezone": "America/Lima"
    },
    {
      "city": "Lamas",
      "timezone": "America/Lima"
    },
    {
      "city": "Nauta",
      "timezone": "America/Lima"
    },
    {
      "city": "Puquio",
      "timezone": "America/Lima"
    },
    {
      "city": "Chosica",
      "timezone": "America/Lima"
    },
    {
      "city": "Satipo",
      "timezone": "America/Lima"
    },
    {
      "city": "Tarma",
      "timezone": "America/Lima"
    },
    {
      "city": "La Oroya",
      "timezone": "America/Lima"
    },
    {
      "city": "Huaura",
      "timezone": "America/Lima"
    },
    {
      "city": "Huacho",
      "timezone": "America/Lima"
    },
    {
      "city": "Pimentel",
      "timezone": "America/Lima"
    },
    {
      "city": "Olmos",
      "timezone": "America/Lima"
    },
    {
      "city": "Sechura",
      "timezone": "America/Lima"
    },
    {
      "city": "Chulucanas",
      "timezone": "America/Lima"
    },
    {
      "city": "Sullana",
      "timezone": "America/Lima"
    },
    {
      "city": "Abancay",
      "timezone": "America/Lima"
    },
    {
      "city": "Camana",
      "timezone": "America/Lima"
    },
    {
      "city": "Sicuani",
      "timezone": "America/Lima"
    },
    {
      "city": "Puno",
      "timezone": "America/Lima"
    },
    {
      "city": "Ayaviri",
      "timezone": "America/Lima"
    },
    {
      "city": "Ilave",
      "timezone": "America/Lima"
    },
    {
      "city": "Desaguadero",
      "timezone": "America/Lima"
    },
    {
      "city": "Huarmey",
      "timezone": "America/Lima"
    },
    {
      "city": "Cajabamba",
      "timezone": "America/Lima"
    },
    {
      "city": "Jaen",
      "timezone": "America/Lima"
    },
    {
      "city": "Chota",
      "timezone": "America/Lima"
    },
    {
      "city": "Tingo Maria",
      "timezone": "America/Lima"
    },
    {
      "city": "Moyobamba",
      "timezone": "America/Lima"
    },
    {
      "city": "Juanjui",
      "timezone": "America/Lima"
    },
    {
      "city": "Tocache",
      "timezone": "America/Lima"
    },
    {
      "city": "Sechura",
      "timezone": "America/Lima"
    },
    {
      "city": "Chachapoyas",
      "timezone": "America/Lima"
    },
    {
      "city": "Caballococha",
      "timezone": "America/Lima"
    },
    {
      "city": "Puca Urco",
      "timezone": "America/Lima"
    },
    {
      "city": "Andoas",
      "timezone": "America/Lima"
    },
    {
      "city": "Soldado Bartra",
      "timezone": "America/Lima"
    },
    {
      "city": "Nuevo Rocafuerte",
      "timezone": "America/Guayaquil"
    },
    {
      "city": "Requena",
      "timezone": "America/Lima"
    },
    {
      "city": "Huanta",
      "timezone": "America/Lima"
    },
    {
      "city": "Coracora",
      "timezone": "America/Lima"
    },
    {
      "city": "Chincha Alta",
      "timezone": "America/Lima"
    },
    {
      "city": "Santiago",
      "timezone": "America/Lima"
    },
    {
      "city": "San Ramon",
      "timezone": "America/Lima"
    },
    {
      "city": "Junin",
      "timezone": "America/Lima"
    },
    {
      "city": "Jauja",
      "timezone": "America/Lima"
    },
    {
      "city": "Pativilca",
      "timezone": "America/Lima"
    },
    {
      "city": "Chancay",
      "timezone": "America/Lima"
    },
    {
      "city": "Chilca",
      "timezone": "America/Lima"
    },
    {
      "city": "Chiclayo",
      "timezone": "America/Lima"
    },
    {
      "city": "Juliaca",
      "timezone": "America/Lima"
    },
    {
      "city": "Cerro de Pasco",
      "timezone": "America/Lima"
    },
    {
      "city": "Tarapoto",
      "timezone": "America/Lima"
    },
    {
      "city": "Ayacucho",
      "timezone": "America/Lima"
    },
    {
      "city": "Callao",
      "timezone": "America/Lima"
    },
    {
      "city": "Paita",
      "timezone": "America/Lima"
    },
    {
      "city": "Talara",
      "timezone": "America/Lima"
    },
    {
      "city": "Tumbes",
      "timezone": "America/Lima"
    },
    {
      "city": "Puerto Maldonado",
      "timezone": "America/Lima"
    },
    {
      "city": "Ilo",
      "timezone": "America/Lima"
    },
    {
      "city": "Moquegua",
      "timezone": "America/Lima"
    },
    {
      "city": "Huaraz",
      "timezone": "America/Lima"
    },
    {
      "city": "Cajamarca",
      "timezone": "America/Lima"
    },
    {
      "city": "Huanuco",
      "timezone": "America/Lima"
    },
    {
      "city": "Pacasmayo",
      "timezone": "America/Lima"
    },
    {
      "city": "Salaverry",
      "timezone": "America/Lima"
    },
    {
      "city": "Gueppi",
      "timezone": "America/Lima"
    },
    {
      "city": "Contamana",
      "timezone": "America/Lima"
    },
    {
      "city": "Huancavelica",
      "timezone": "America/Lima"
    },
    {
      "city": "Pisco",
      "timezone": "America/Lima"
    },
    {
      "city": "Nasca",
      "timezone": "America/Lima"
    },
    {
      "city": "Piura",
      "timezone": "America/Lima"
    },
    {
      "city": "Arequipa",
      "timezone": "America/Lima"
    },
    {
      "city": "Chimbote",
      "timezone": "America/Lima"
    },
    {
      "city": "Pucallpa",
      "timezone": "America/Lima"
    },
    {
      "city": "Iquitos",
      "timezone": "America/Lima"
    },
    {
      "city": "Huancayo",
      "timezone": "America/Lima"
    },
    {
      "city": "Cusco",
      "timezone": "America/Lima"
    },
    {
      "city": "Tacna",
      "timezone": "America/Lima"
    },
    {
      "city": "Trujillo",
      "timezone": "America/Lima"
    },
    {
      "city": "Ica",
      "timezone": "America/Lima"
    },
    {
      "city": "Lima",
      "timezone": "America/Lima"
    },
    {
      "city": "San Carlos",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Cadiz",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Pagadian",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Ozamis",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Tarlac",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Cabanatuan",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Olongapo",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Dagupan",
      "timezone": "Asia/Manila"
    },
    {
      "city": "San Pablo",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Quezon City",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Pasay City",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Iligan",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Ormac",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Tacloban",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Butuan",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Tagum",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Surigao",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Gingoog",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Legazpi",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Tuguegarao",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Vigan",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Bacolod",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Roxas",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Puerto Princesa",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Naga",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Angeles",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Batangas",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Cotabato",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Calbayog",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Cagayan de Oro",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Zamboanga",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Laoag",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Baguio City",
      "timezone": "Asia/Manila"
    },
    {
      "city": "General Santos",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Cebu",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Iloilo",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Davao",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Manila",
      "timezone": "Asia/Manila"
    },
    {
      "city": "Olsztyn",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Elblag",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Inowroclaw",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Bytom",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Opole",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Koszalin",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Elk",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Gdynia",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Wroclaw",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Szczecin",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Zielona Gora",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Poznan",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Grudziadz",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Bydgoszcz",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Katowice",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Gliwice",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Kielce",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Bialystok",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Lublin",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Rzeszow",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Lódz",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Gdansk",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Kraków",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Warsaw",
      "timezone": "Europe/Warsaw"
    },
    {
      "city": "Aveiro",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Leiria",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Viana Do Castelo",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Beja",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Evora",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Portalegre",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Santarem",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Braganca",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Castelo Branco",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Guarda",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Viseu",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Vila Real",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Braga",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Covilha",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Horta",
      "timezone": "Atlantic/Azores"
    },
    {
      "city": "Angra do Heroismo",
      "timezone": "Atlantic/Azores"
    },
    {
      "city": "Portimao",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Faro",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Coimbra",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Setubal",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Porto",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Funchal",
      "timezone": "Atlantic/Madeira"
    },
    {
      "city": "Ponta Delgada",
      "timezone": "Atlantic/Azores"
    },
    {
      "city": "Lisbon",
      "timezone": "Europe/Lisbon"
    },
    {
      "city": "Ponce",
      "timezone": "America/Puerto_Rico"
    },
    {
      "city": "Mayaguez",
      "timezone": "America/Puerto_Rico"
    },
    {
      "city": "Arecibo",
      "timezone": "America/Puerto_Rico"
    },
    {
      "city": "San Juan",
      "timezone": "America/Puerto_Rico"
    },
    {
      "city": "Doha",
      "timezone": "Asia/Qatar"
    },
    {
      "city": "Targu Jiu",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Slatina",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Alexandria",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Targoviste",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Giurgiu",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Slobozia",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Alba Lulia",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Bistrita",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Deva",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Zalau",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Satu Mare",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Rimnicu Vilcea",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Sfintu-Gheorghe",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Miercurea Cuic",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Piatra-Neamt",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Braila",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Vaslui",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Drobeta-Turnu Severin",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Tulcea",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Arad",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Oradea",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Sibiu",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Suceava",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Buzau",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Galati",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Focsani",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Craiova",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Calarasi",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Resita",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Timisoara",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Botosani",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Baia Mare",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Tirgu Mures",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Pitesti",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Brasov",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Ploiesti",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Bacau",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Cluj-Napoca",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Constanta",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Iasi",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Bucharest",
      "timezone": "Europe/Bucharest"
    },
    {
      "city": "Nazran",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Ust' Ordynskiy",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Maykop",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Mozdok",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Georgievsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Pyatigorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kislovodsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Nevinnomyssk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Enurmino",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Lavrentiya",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Zvezdnyy",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Mikhalkino",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Chernyakhovsk",
      "timezone": "Europe/Kaliningrad"
    },
    {
      "city": "Severomorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Apatity",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Polyarnyy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Slantsy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kolpino",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Novozybkov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Dyatkovo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Shuya",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kineshma",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Balakhna",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Arzamas",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Rzhev",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vyshnniy Volochek",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Uglich",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Yelets",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Orekhovo-Zuevo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Klin",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sergiyev Posad",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kolomna",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Bataysk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Taganrog",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Novocherkassk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kamensk Shakhtinskiy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Novoshakhtinsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Aleksin",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Novomoskovsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Shchekino",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Nikolayevsk",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Shebekino",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Gubkin",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Apsheronsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kropotkin",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Ruzayevka",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kirsanov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Michurinsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Borisoglebsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Oktyabrskiy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Plast",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Bakal",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Verkhniy Ufaley",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Severnyy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kirovo-Chepetsk",
      "timezone": "Europe/Kirov"
    },
    {
      "city": "Krasnoturinsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Asbest",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Alapayevsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Krasnouralsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Severouralsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Novotroitsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Buguruslan",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Chapayevsk",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Syzran",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Novokuybishevsk",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Naberezhnyye Chelny",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Zelenodolsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Leninogorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Bugulma",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Nefteyugansk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Leninsk Kuznetsky",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Anzhero Sudzhensk",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Kiselevsk",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Mundybash",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Chernogorsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Abaza",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Iskitim",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Toguchin",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Kupina",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Zaozernyy",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Bogotol",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Shilka",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Sherlovaya Gora",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Petrovsk Zabaykalskiy",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Arsenyev",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Partizansk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Dalnerechensk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Zemlya Bunge",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Khorgo",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Put Lenina",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Obluchye",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Vanino",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Omchak",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Uglegorsk",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Kholmsk",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Solikamsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kizel",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Pakhachi",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Oymyakon",
      "timezone": null
    },
    {
      "city": "Timiryazevskiy",
      "timezone": "Asia/Tomsk"
    },
    {
      "city": "Asino",
      "timezone": "Asia/Tomsk"
    },
    {
      "city": "Strezhevoy",
      "timezone": "Asia/Tomsk"
    },
    {
      "city": "Cherkessk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vladikavkaz",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Blagodarnyy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Zelenokumsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Mukhomornoye",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Beringovskiy",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Bilibino",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Mys Shmidta",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Egvekinot",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Sovetsk",
      "timezone": "Europe/Kaliningrad"
    },
    {
      "city": "Nikel",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Monchegorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kirovsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Borovichi",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Staraya Russa",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Volkhov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Tikhvin",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Svetogorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Gatchina",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Luga",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Klintsy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Roslavl",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Safonovo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vyazma",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Segezha",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vichuga",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sharya",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Buy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Dzerzhinsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vyska",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kimry",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Bezhetsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Nelidovo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Bologoye",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Torzhok",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sokol",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Cherepovets",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Rybinsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Rostov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kaluga",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kirov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Obninsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Lgov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Zheleznogorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Gryazi",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Yegoryevsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Podolsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Solnechnogorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Noginsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Serpukhov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Livny",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Mtsensk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Salsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Belaya Kalitva",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Shakhty",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Millerovo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Yefremov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Bogoroditsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kamyshin",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Pallasovka",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Frolovo",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Volzhskiy",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Mikhaylovka",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Uryupinsk",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Starsy Oskol",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Alekseyevka",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Valuyki",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Tuapse",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Gelendzhik",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Labinsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Armavir",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Timashevsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Tikhoretsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Yeysk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Saransk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kamenka",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kuznetsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Serdobsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kasimov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sasovo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kotovsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Morshansk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kovrov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Murom",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Rayevskiy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Sibay",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kumertau",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Salavat",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Belebey",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Tuymazy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Neftekamsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Troitsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Yemanzhelinsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kartaly",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Asha",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Miass",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kyshtym",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kurtamysh",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Shadrinsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Varnek",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Bugrino",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Yamburg",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Nakhodka",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Sosnogorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sovetsk",
      "timezone": "Europe/Kirov"
    },
    {
      "city": "Slobodskoy",
      "timezone": "Europe/Kirov"
    },
    {
      "city": "Kirs",
      "timezone": "Europe/Kirov"
    },
    {
      "city": "Omutninsk",
      "timezone": "Europe/Kirov"
    },
    {
      "city": "Kotelnich",
      "timezone": "Europe/Kirov"
    },
    {
      "city": "Yoshkar Ola",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kamensk Uralskiy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Polevskoy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Tavda",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Artemovskiy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Nevyansk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Verkhnyaya Salda",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Nizhnyaya Tura",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Karpinsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Ivdel",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Krasnoufimsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Sarapul",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Mozhga",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Votkinsk",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Glazov",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Kanash",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Shumerlya",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Alatyr",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sol-lletsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Dombarovskiy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Mednogorsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Gay",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Buzuluk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Otradnyy",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Tolyatti",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Engels",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Pugachev",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Volsk",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Atkarsk",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Balashov",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Almetyevsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Chistopol",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Nizhnekamsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Dimitrovgrad",
      "timezone": "Europe/Ulyanovsk"
    },
    {
      "city": "Peregrebnoye",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Saranpaul",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Uray",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Laryak",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kogalym",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Megion",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Cherlak",
      "timezone": "Asia/Omsk"
    },
    {
      "city": "Kalachinsk",
      "timezone": "Asia/Omsk"
    },
    {
      "city": "Nazyvayevsk",
      "timezone": "Asia/Omsk"
    },
    {
      "city": "Isikul",
      "timezone": "Asia/Omsk"
    },
    {
      "city": "Ishim",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Golyshmanovo",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Yalutorovsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Biysk",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Zmeinogorsk",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Aleysk",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Novoaltaysk",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Kamenna Obi",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Gornyak",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Kulunda",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Slavgorod",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Tashtagol",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Guryevsk",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Yurga",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Topki",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Mariinsk",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Shira",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Cherepanovo",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Kargat",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Ob",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Karasuk",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Barabinsk",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Tatarsk",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Kaspiysk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Derbent",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Buynaksk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Yessey",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Ulkan",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Kirensk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Zheleznogorsk Ilimskiy",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Vikhorevka",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Biryusinsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Kodinskiy",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Artemovsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Uyar",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Uzhur",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Sayanogorsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Podkamennaya",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Igarka",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Agapa",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Boyarka",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Nordvik",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Chelyuskin",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Taksimo",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Gusinoozyorsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Aginskoye",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Progress",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Belogorsk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Nyukzha",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Nerchinsk",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Kavalerovo",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Spassk Dalniy",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Shalaurova",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Logashkino",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Ust Kuyga",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Pokrovsk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Verkhnevilyuysk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Vitim",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Olyokminsk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Tunguskhaya",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Natara",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Zhilinda",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Trofimovsk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Tukchi",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Amursk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Bikin",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Vyazemskiy",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Chegdomyn",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Siglan",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Karamken",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Strelka",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Severo Kurilsk",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Krasnogorsk",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Poronaysk",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Makarov",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Dolinsk",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Nevelsk",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Kudymkar",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kungur",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Krasnokamsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Chusovoy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Gubakha",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Utkholok",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Bol'sheretsk",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Il'pyrskiy",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Korf",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Kolpashevo",
      "timezone": "Asia/Tomsk"
    },
    {
      "city": "Omolon",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Pevek",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Umba",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kovda",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Velikiy Novgorod",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Velikiye Luki",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Belomorsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kem",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Krasino",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Matochkin Shar",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Severodvinsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kursk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Tula",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Tambov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sterlitamak",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Kurgan",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Indiga",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Shoyna",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Novy Port",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Salekhard",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Gyda",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Tazovskiy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Novy Urengoy",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Nadym",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Noyabrsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Syktyvkar",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Ukhta",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Serov",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Cheboksary",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Orsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Balakovo",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Igrim",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Nyagan",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Khanty Mansiysk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Nizhenvartovsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Numto",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Tara",
      "timezone": "Asia/Omsk"
    },
    {
      "city": "Tobolsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Rubtsovsk",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Gorno Altaysk",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Prokopyevsk",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Makhachkala",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Tura",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Noginsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Yerema",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Tayshet",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Usolye Sibirskoye",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Slyudyanka",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Cheremkhovo",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Zima",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Tulun",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Nizhneudinsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Ust Kut",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Bodaybo",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Komsa",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Kansk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Achinsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Yeniseysk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Lesosibirsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Turukhansk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Vorontsovo",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Starorybnoye",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Mikhaylova",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Dudinka",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Teli",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Novyy Uoyin",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Bagdarin",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Severobaykalsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Kyakhta",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Svobodnyy",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Zeya",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Magdagachi",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Shimanovsk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Skovorodino",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Tynda",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Olovyannaya",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Mogocha",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Krasnokamensk",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Borzya",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Khilok",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Nakhodka",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Ussuriysk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Lesozavodsk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Kavache",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Verkhoyansk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Cherskiy",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Srednekolymsk",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Zyryanka",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Eldikan",
      "timezone": "Asia/Khandyga"
    },
    {
      "city": "Chagda",
      "timezone": "Asia/Khandyga"
    },
    {
      "city": "Khandyga",
      "timezone": "Asia/Khandyga"
    },
    {
      "city": "Ust Maya",
      "timezone": "Asia/Khandyga"
    },
    {
      "city": "Neryungri",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Chernyshevskiy",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Terbyas",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Vilyuysk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Sangar",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Menkere",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Saskylakh",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Govorovo",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Sagastyr",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Ust Olensk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Suntar",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Olenek",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Udachnyy",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Birobidzhan",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Khakhar",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "De Kastri",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Chumikan",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Komsomolsk na Amure",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Ayan",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Nikolayevsk na Amure",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Savetskaya Gavan",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Evensk",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Palatka",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Omsukchan",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Susuman",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Nogliki",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Aleksandrovsk Sakhalinskiy",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Korsakov",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Manily",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Oktyabrskiy",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Klyuchi",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Ust Kamchatsk",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Provideniya",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Uelen",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Kandalaksha",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vyborg",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kondopoga",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Rusanovo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Mezen",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Velsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kotlas",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Onega",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Ivanovo",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kostroma",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Velikiy Ustyug",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Lipetsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Orel",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Volgodonsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Belgorod",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Novorossiysk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vladimir",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Birsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Zlatoust",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Amderma",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Naryan Mar",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Inta",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Usinsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Pechora",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Pervouralsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Izhevsk",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Akhtubinsk",
      "timezone": "Europe/Astrakhan"
    },
    {
      "city": "Elista",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Krasnoarmeysk",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Berezniki",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Naltchik",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Stavropol",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Ugolnye Kopi",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Kaliningrad",
      "timezone": "Europe/Kaliningrad"
    },
    {
      "city": "Pskov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Bryansk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Smolensk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Petrozavodsk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Tver",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Vologda",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Yaroslavl",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Rostov",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Sochi",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Krasnodar",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Penza",
      "timezone": null
    },
    {
      "city": "Ryazan",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Voronezh",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Magnitogorsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Chelyabinsk",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Vorkuta",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Kirov",
      "timezone": "Europe/Kirov"
    },
    {
      "city": "Nizhny Tagil",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Astrakhan",
      "timezone": "Europe/Astrakhan"
    },
    {
      "city": "Orenburg",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Saratov",
      "timezone": "Europe/Saratov"
    },
    {
      "city": "Ulyanovsk",
      "timezone": "Europe/Ulyanovsk"
    },
    {
      "city": "Omsk",
      "timezone": "Asia/Omsk"
    },
    {
      "city": "Tyumen",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Novokuznetsk",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Kemerovo",
      "timezone": "Asia/Novokuznetsk"
    },
    {
      "city": "Groznyy",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Ust-Ulimsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Angarsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Abakan",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Norilsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Khatanga",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Kyzyl",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Ulan Ude",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Blagoveshchensk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Bukachacha",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Dalnegorsk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Ambarchik",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Batagay",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Chokurdakh",
      "timezone": "Asia/Srednekolymsk"
    },
    {
      "city": "Ust Nera",
      "timezone": "Asia/Ust-Nera"
    },
    {
      "city": "Lensk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Aldan",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Mirnyy",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Zhigansk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Okhotsk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Khabarovsk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Okha",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Yuzhno Sakhalinsk",
      "timezone": "Asia/Sakhalin"
    },
    {
      "city": "Tomsk",
      "timezone": "Asia/Tomsk"
    },
    {
      "city": "Anadyr",
      "timezone": "Asia/Anadyr"
    },
    {
      "city": "Murmansk",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Archangel",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Nizhny Novgorod",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Volgograd",
      "timezone": "Europe/Volgograd"
    },
    {
      "city": "Ufa",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Yekaterinburg",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Samara",
      "timezone": "Europe/Samara"
    },
    {
      "city": "Kazan",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Surgut",
      "timezone": "Asia/Yekaterinburg"
    },
    {
      "city": "Barnaul",
      "timezone": "Asia/Barnaul"
    },
    {
      "city": "Novosibirsk",
      "timezone": "Asia/Novosibirsk"
    },
    {
      "city": "Bratsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Irkutsk",
      "timezone": "Asia/Irkutsk"
    },
    {
      "city": "Krasnoyarsk",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Dickson",
      "timezone": "Asia/Krasnoyarsk"
    },
    {
      "city": "Chita",
      "timezone": "Asia/Chita"
    },
    {
      "city": "Vladivostok",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Nizhneyansk",
      "timezone": "Asia/Vladivostok"
    },
    {
      "city": "Yakutsk",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Tiksi",
      "timezone": "Asia/Yakutsk"
    },
    {
      "city": "Magadan",
      "timezone": "Asia/Magadan"
    },
    {
      "city": "Perm",
      "timezone": null
    },
    {
      "city": "Palana",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "Petropavlovsk Kamchatskiy",
      "timezone": "Asia/Kamchatka"
    },
    {
      "city": "St. Petersburg",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Moscow",
      "timezone": "Europe/Moscow"
    },
    {
      "city": "Gikongoro",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Kibuye",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Kibungo",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Nyanza",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Gitarama",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Butare",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Gisenyi",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Cyangugu",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Byumba",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Ruhengeri",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Kigali",
      "timezone": "Africa/Kigali"
    },
    {
      "city": "Basseterre",
      "timezone": "America/St_Kitts"
    },
    {
      "city": "Castries",
      "timezone": "America/St_Lucia"
    },
    {
      "city": "Kingstown",
      "timezone": "America/St_Vincent"
    },
    {
      "city": "Apia",
      "timezone": "Pacific/Apia"
    },
    {
      "city": "San Marino",
      "timezone": "Europe/San_Marino"
    },
    {
      "city": "Santo Antonio",
      "timezone": "Africa/Sao_Tome"
    },
    {
      "city": "Sao Tome",
      "timezone": "Africa/Sao_Tome"
    },
    {
      "city": "An Nabk",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Sakakah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Yanbu al Bahr",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Dawmat al Jandal",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Qal at Bishah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "At Taif",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Najran",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Quwayiyah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Hillah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Mubarraz",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al-Qatif",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Az Zahran",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Buraydah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Hail",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Arar",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Rafha",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Kharj",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Ad Damman",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Hafar al Batin",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Jubayl",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Qunfudhah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Hufuf",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Al Wajh",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Abha",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Jizan",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "As Sulayyil",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Medina",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Tabuk",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Jeddah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Makkah",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Riyadh",
      "timezone": "Asia/Riyadh"
    },
    {
      "city": "Fatick",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Diourbel",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Louga",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Thies",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Kolda",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Tambacounda",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Kedougou",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Ziguinchor",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Kaolack",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Kaedi",
      "timezone": "Africa/Nouakchott"
    },
    {
      "city": "Dakar",
      "timezone": "Africa/Dakar"
    },
    {
      "city": "Subotica",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Kragujevac",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Zrenjanin",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Pec",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Nis",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Novi Sad",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Belgrade",
      "timezone": "Europe/Belgrade"
    },
    {
      "city": "Victoria",
      "timezone": "Indian/Mahe"
    },
    {
      "city": "Makeni",
      "timezone": "Africa/Freetown"
    },
    {
      "city": "Koidu",
      "timezone": "Africa/Freetown"
    },
    {
      "city": "Kenema",
      "timezone": "Africa/Freetown"
    },
    {
      "city": "Bo",
      "timezone": "Africa/Freetown"
    },
    {
      "city": "Freetown",
      "timezone": "Africa/Freetown"
    },
    {
      "city": "Singapore",
      "timezone": "Asia/Singapore"
    },
    {
      "city": "Banska Bystrica",
      "timezone": "Europe/Bratislava"
    },
    {
      "city": "Trnava",
      "timezone": "Europe/Bratislava"
    },
    {
      "city": "Zvolen",
      "timezone": "Europe/Bratislava"
    },
    {
      "city": "Zilina",
      "timezone": "Europe/Bratislava"
    },
    {
      "city": "Kosice",
      "timezone": "Europe/Bratislava"
    },
    {
      "city": "Presov",
      "timezone": "Europe/Bratislava"
    },
    {
      "city": "Bratislava",
      "timezone": "Europe/Bratislava"
    },
    {
      "city": "Maribor",
      "timezone": "Europe/Ljubljana"
    },
    {
      "city": "Ljubljana",
      "timezone": "Europe/Ljubljana"
    },
    {
      "city": "Gizo",
      "timezone": "Pacific/Guadalcanal"
    },
    {
      "city": "Lata",
      "timezone": "Pacific/Guadalcanal"
    },
    {
      "city": "Honiara",
      "timezone": "Pacific/Guadalcanal"
    },
    {
      "city": "Hudur",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Garbahaarey",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Bu'aale",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Dhuusa Mareeb",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Buurhakaba",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Luuq",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Mandera",
      "timezone": "Africa/Nairobi"
    },
    {
      "city": "Ferfer",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Jawhar",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Hurdiyo",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Qardho",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Caluula",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Buur Gaabo",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Baydhabo",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Marka",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Mereeg",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Beledweyne",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Boosaaso",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Bandarbeyla",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Gaalkacyo",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Eyl",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Garoowe",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Jamaame",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Kismaayo",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Mogadishu",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Laascaanood",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Ceerigaabo",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Boorama",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Burco",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Maydh",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Berbera",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Hargeysa",
      "timezone": "Africa/Mogadishu"
    },
    {
      "city": "Qacha's Nek",
      "timezone": "Africa/Maseru"
    },
    {
      "city": "Colesberg",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Poffader",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Carnarvon",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Prieska",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Kuruman",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Knysna",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Swellendam",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Hermanus",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Paarl",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Bredasdorp",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Beaufort West",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Brits",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Bloemhof",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Potchefstroom",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Brandfort",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Bethlehem",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Springs",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Volksrust",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Mbombela",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Komatipoort",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Middelburg",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Bethal",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Standerton",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Lebowakgomo",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Tzaneen",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Ulundi",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Ladysmith",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Port Shepstone",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Ubomba",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Cradock",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Uitenhage",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Port Alfred",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Grahamstown",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Port St. Johns",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Aliwal North",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Queenstown",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Benoni",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Vereeniging",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "De Aar",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Alexander Bay",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Kimberley",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Oudtshoorn",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Vanhynsdorp",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Saldanha",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Mossel Bay",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Vryburg",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Rustenburg",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Mmabatho",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Klerksdorp",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Kroonstad",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Polokwane",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Thohoyandou",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Musina",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Vryheid",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Pietermaritzburg",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Umtata",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Graaff Reinet",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Bhisho",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Springbok",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Upington",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Worcester",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "George",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Welkom",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "East London",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Middelburg",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Bloemfontein",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Pretoria",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Port Elizabeth",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Durban",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Johannesburg",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Cape Town",
      "timezone": "Africa/Johannesburg"
    },
    {
      "city": "Grytviken",
      "timezone": "Atlantic/South_Georgia"
    },
    {
      "city": "Eumseong",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Cheongju",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Wonju",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Chuncheon",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Ansan",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Iksan",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Gyeongju",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Changwon",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Yeosu",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Andong",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Jeju",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Gangneung",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Sokcho",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Jeonju",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Gunsan",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Mokpo",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Puch'on",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Songnam",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Goyang",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Suwon",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Pohang",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Ulsan",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Daegu",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Incheon",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Daejeon",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Gwangju",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Busan",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Seoul",
      "timezone": "Asia/Seoul"
    },
    {
      "city": "Bentiu",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Maridi",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Yei",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Melut",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Nasir",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Gogrial",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Kapoeta",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Aweil",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Rumbek",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Yambio",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Bor",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Nimule",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Juba",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Malakal",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Wau",
      "timezone": "Africa/Juba"
    },
    {
      "city": "Merida",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Marbella",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Linares",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Algeciras",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Leon",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Mataro",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Gijon",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Vitoria",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Almeria",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Malaga",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Jaén",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Huelva",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Albacete",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Toledo",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Guadalajara",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Santander",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Salamanca",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Burgos",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Tarragona",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Lorca",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Cartagena",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Oviedo",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Santiago de Compostela",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Badajoz",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Logrono",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "San Sebastián",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Alicante",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Castello",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Arrecife",
      "timezone": "Atlantic/Canary"
    },
    {
      "city": "Cadiz",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Granada",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Murcia",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Ceuta",
      "timezone": "Africa/Ceuta"
    },
    {
      "city": "La Coruña",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Ourense",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Pamplona",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Valladolid",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Melilla",
      "timezone": "Africa/Ceuta"
    },
    {
      "city": "Palma",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Zaragoza",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Santa Cruz de Tenerife",
      "timezone": "Atlantic/Canary"
    },
    {
      "city": "Cordoba",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Vigo",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Bilbao",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Las Palmas",
      "timezone": "Atlantic/Canary"
    },
    {
      "city": "Seville",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Valencia",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Barcelona",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Madrid",
      "timezone": "Europe/Madrid"
    },
    {
      "city": "Trincomalee",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Puttalan",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Ratnapura",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Batticaloa",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Kilinochchi",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Matara",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Badulla",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Moratuwa",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Galle",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Anuradhapura",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Jaffna",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Kandy",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Sri Jawewardenepura Kotte",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Colombo",
      "timezone": "Asia/Colombo"
    },
    {
      "city": "Ad Damazin",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Haiya",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "El Manaqil",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Shendi",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Berber",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Kerma",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Ed Dueim",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Umm Ruwaba",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "En Nuhud",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Muglad",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Tokar",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Medani",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Gedaref",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "EdDamer",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Atbara",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Wadi Halfa",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Merowe",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Kosti",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Sennar",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "El Fasher",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Kadugli",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Babanusa",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Geneina",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Omdurman",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "El Obeid",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Port Sudan",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Niyala",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Dongola",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Kassala",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Khartoum",
      "timezone": "Africa/Khartoum"
    },
    {
      "city": "Onverwacht",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Groningen",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Brownsweg",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Moengo",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Nieuw Amsterdam",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Nieuw Nickerie",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Brokopondo",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Totness",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Cottica",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Paramaribo",
      "timezone": "America/Paramaribo"
    },
    {
      "city": "Longyearbyen",
      "timezone": "Arctic/Longyearbyen"
    },
    {
      "city": "Piggs Peak",
      "timezone": "Africa/Mbabane"
    },
    {
      "city": "Siteki",
      "timezone": "Africa/Mbabane"
    },
    {
      "city": "Manzini",
      "timezone": "Africa/Mbabane"
    },
    {
      "city": "Hlatikulu",
      "timezone": "Africa/Mbabane"
    },
    {
      "city": "Golela",
      "timezone": "Africa/Mbabane"
    },
    {
      "city": "Lobamba",
      "timezone": "Africa/Mbabane"
    },
    {
      "city": "Mbabane",
      "timezone": "Africa/Mbabane"
    },
    {
      "city": "Falun",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Nykoping",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Harnosand",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Karlskrona",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Mariestad",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Vannersborg",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Borlänge",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Västerås",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Bollnäs",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Gävle",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Kalmar",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Växjö",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Örebro",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Norrköping",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Halmstad",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Karlstad",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Skellefteå",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Visby",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Trollhättan",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Borås",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Kristianstad",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Helsingborg",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Jönköping",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Örnsköldsvik",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Linköping",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Östersund",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Kiruna",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Umeå",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Uppsala",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Göteborg",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Luleå",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Sundsvall",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Malmö",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Stockholm",
      "timezone": "Europe/Stockholm"
    },
    {
      "city": "Delemont",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Neuchatel",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Aarau",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Stans",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Sion",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Herisau",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Saint Gallen",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Bellinzona",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Glarus",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Schaffhausen",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Schwyz",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Frauenfeld",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Altdorf",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Zug",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Fribourg",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Liestal",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Solothurn",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Sarnen",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Appenzell",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Chur",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Biel",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Luzern",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Lugano",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Lausanne",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Basel",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Bern",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Zürich",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Geneva",
      "timezone": "Europe/Zurich"
    },
    {
      "city": "Dar'a",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Al Ladhiqiyah",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Madinat ath Thawrah",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Izaz",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Manbij",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Idlib",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Al Qamishli",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Al Hasakah",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Douma",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Tartus",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Ar Raqqah",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Hamah",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Tadmur",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Abu Kamal",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Dayr az Zawr",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "As Suwayda",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Ad Nabk",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Al Qunaytirah",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Hims",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Aleppo",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Damascus",
      "timezone": "Asia/Damascus"
    },
    {
      "city": "Bade",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Pingzhen",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Taibao",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Taoyuan",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Yangmei",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Yilan",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Zhubei",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Douliou",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Zhongli",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Keelung",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Nantou",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Puzi",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Changhua",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Chiayi",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Hsinchu",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Miaoli",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Pingtung",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Hualien",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "New Taipei",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Tainan",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Taitung",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Magong",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Taichung",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Kaohsiung",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Taipei",
      "timezone": "Asia/Taipei"
    },
    {
      "city": "Leninobod",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Qurghonteppa",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Konibodom",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Kuybyshevskiy",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Kulob",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Uroteppa",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Khorugh",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Khujand",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Dushanbe",
      "timezone": "Asia/Dushanbe"
    },
    {
      "city": "Wete",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kibaha",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mkokotoni",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Tunduma",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Tukuyu",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Sumbawanga",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mpanda",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kipili",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Karema",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Geita",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Nyahanga",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kahama",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Shinyanga",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Nzega",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Sikonge",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Biharamulo",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Bukoba",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Ngara",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kakonko",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kasulu",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kanyato",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Uvinza",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kigoma",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mikumi",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Ifakara",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kilosa",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Chake Chake",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kibiti",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Bagamoyo",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Kilindoni",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mpwapwa",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Njombe",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Iringa",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Masasi",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mtwara",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Tunduru",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mbamba Bay",
      "timezone": "Africa/Blantyre"
    },
    {
      "city": "Manyoni",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Itigi",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Singida",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Ngorongoro",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Oldeani",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mbulu",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Babati",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Same",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Moshi",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Musoma",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Korogwe",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Tabora",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Lindi",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Songea",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Tanga",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mwanza",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Morogoro",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Dodoma",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Arusha",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mbeya",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Zanzibar",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Dar es Salaam",
      "timezone": "Africa/Dar_es_Salaam"
    },
    {
      "city": "Mae Hong Son",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phangnga",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Ranong",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Krabi",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phatthalung",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Satun",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Lamphun",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Kamphaeng Phet",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phichit",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phetchabun",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Supham Buri",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Ang Thong",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chainat",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nakhon Nayok",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Sing Buri",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nakhon Pathom",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Prachuap Khiri Khan",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Samut Sakhon",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Samut Songkhram",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Yasothon",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chachoengsao",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Trat",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Kalasin",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Maha Sarakham",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Roi Et",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Pattani",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chumphon",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Thung Song",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Trang",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Yala",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chiang Rai",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Lampang",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nan",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phayao",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phrae",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phitsanulok",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Sukhothai",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Uttaradit",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Kanchanaburi",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Mae Sot",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Tak",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Uthai Thani",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Lop Buri",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Prachin Buri",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Ayutthaya",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Pathum Thani",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Saraburi",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nonthaburi",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phetchaburi",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Hua Hin",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Ratchaburi",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Samut Prakan",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Sisaket",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Si Racha",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chon Buri",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chanthaburi",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Aranyaprathet",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Rayong",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Buriram",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chaiyaphum",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Bua Yai",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Surin",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Loei",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nong Khai",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Sakhon Nakhon",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Udon Thani",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nakhon Phanom",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Narathiwat",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Khon Kaen",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Phuket",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nakhon Si Thammarat",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Songkhla",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Hat Yai",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nakhon Sawan",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Ubon Ratchathani",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Surat Thani",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Chiang Mai",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Nakhon Ratchasima",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Bangkok",
      "timezone": "Asia/Bangkok"
    },
    {
      "city": "Freeport",
      "timezone": "America/Nassau"
    },
    {
      "city": "Nassau",
      "timezone": "America/Nassau"
    },
    {
      "city": "Georgetown",
      "timezone": "Africa/Banjul"
    },
    {
      "city": "Basse Santa Su",
      "timezone": "Africa/Banjul"
    },
    {
      "city": "Kerewan",
      "timezone": "Africa/Banjul"
    },
    {
      "city": "Mansa Konko",
      "timezone": "Africa/Banjul"
    },
    {
      "city": "Bansang",
      "timezone": "Africa/Banjul"
    },
    {
      "city": "Brikama",
      "timezone": "Africa/Banjul"
    },
    {
      "city": "Banjul",
      "timezone": "Africa/Banjul"
    },
    {
      "city": "Bassar",
      "timezone": "Africa/Lome"
    },
    {
      "city": "Sotouboua",
      "timezone": "Africa/Lome"
    },
    {
      "city": "Kpalime",
      "timezone": "Africa/Lome"
    },
    {
      "city": "Sokode",
      "timezone": "Africa/Lome"
    },
    {
      "city": "Mango",
      "timezone": "Africa/Lome"
    },
    {
      "city": "Atakpame",
      "timezone": "Africa/Lome"
    },
    {
      "city": "Lome",
      "timezone": "Africa/Lome"
    },
    {
      "city": "Neiafu",
      "timezone": "Pacific/Tongatapu"
    },
    {
      "city": "Nukualofa",
      "timezone": "Pacific/Tongatapu"
    },
    {
      "city": "San Fernando",
      "timezone": "America/Port_of_Spain"
    },
    {
      "city": "Port-of-Spain",
      "timezone": "America/Port_of_Spain"
    },
    {
      "city": "Medenine",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Kebili",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Tataouine",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "L'Ariana",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Jendouba",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Kasserine",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Sdid Bouzid",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Siliana",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Mahdia",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Monastir",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Zaghouan",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Ben Gardane",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Zarzis",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Dehibat",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Tozeur",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Beja",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Bizerte",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Nabeul",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "El Kef",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Qasserine",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Gabes",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Gafsa",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Qairouan",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Sfax",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Sousse",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Tunis",
      "timezone": "Africa/Tunis"
    },
    {
      "city": "Kirklareli",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Bilecik",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Sakarya",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kastamonu",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Burdur",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kirsehir",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Nevsehir",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Antioch",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Giresun",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Sinop",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Tokat",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Artvin",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Bingol",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Bitlis",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Cankiri",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Nigde",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Yozgat",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Gumushane",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Siirt",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Tunceli",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Aydin",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Luleburgaz",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Isparta",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kutahya",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Mugla",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Elazig",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kahramanmaras",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Icel",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Corum",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Rize",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Tatvan",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Polatli",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Karabuk",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Nusaybin",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Hakkari",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Soke",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Balikesir",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Canakkale",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Edirne",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Tekirdag",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Izmit",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Bolu",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Afyon",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Denizli",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Manisa",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Adiyaman",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Malatya",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Tarsus",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Samandagi",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Hatay",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Iskenderun",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Amasya",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Ordu",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Sivas",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Bafra",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Erzurum",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Erzincan",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Agri",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Diyarbakir",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Mus",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Zonguldak",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Eregli",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Karaman",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Usak",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kilis",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kirikkale",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kars",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Mardin",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Batman",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Van",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Adapazari",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Trabzon",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Sanliurfa",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Eskisehir",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Antalya",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Kayseri",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Gaziantep",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Izmir",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Bursa",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Samsun",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Konya",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Adana",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Ankara",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Istanbul",
      "timezone": "Europe/Istanbul"
    },
    {
      "city": "Gyzlarbat",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Celeken",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Tejen",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Buzmeyin",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Koneurgench",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Balkanabat",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Kaka",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Atamyrat",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Dasoguz",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Turkmenbasy",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Turkmenabat",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Mary",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Ashgabat",
      "timezone": "Asia/Ashgabat"
    },
    {
      "city": "Grand Turk",
      "timezone": "America/Grand_Turk"
    },
    {
      "city": "Funafuti",
      "timezone": "Pacific/Funafuti"
    },
    {
      "city": "Kalangala",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kumi",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kaberamaido",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kayunga",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Iganga",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kamuli",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Pallisa",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Mpigi",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Adjumani",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Nebbi",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kiboga",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Nakasongola",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Bombo",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Masindi",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Fort Portal",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kibale",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Sironko",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Busia",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Katakwi",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Ntungamo",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kisoro",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Jinja",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Soroti",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Arua",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Pakwach",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Moyo",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Entebbe",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Mubende",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Mityana",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kitgum",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Lira",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Masindi-Port",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Mbale",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Tororo",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kaabong",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Moroto",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Masaka",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Katwe",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Mbarara",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kabale",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kasese",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Gulu",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Kampala",
      "timezone": "Africa/Kampala"
    },
    {
      "city": "Mykolayiv",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Chernihiv",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Khmelnytskyy",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kamyanets-Podilskyy",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Drohobych",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Uzhgorod",
      "timezone": "Europe/Uzhgorod"
    },
    {
      "city": "Uman",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Brovary",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Bila Tserkva",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Illichivsk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Konotop",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kryvyy Rih",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Makiyivka",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Horlivka",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kramatorsk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Berdyansk",
      "timezone": "Europe/Zaporozhye"
    },
    {
      "city": "Dzhankoy",
      "timezone": "Europe/Simferopol"
    },
    {
      "city": "Yevpatoriya",
      "timezone": "Europe/Simferopol"
    },
    {
      "city": "Kerch",
      "timezone": "Europe/Simferopol"
    },
    {
      "city": "Simferopol",
      "timezone": "Europe/Simferopol"
    },
    {
      "city": "Kherson",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Voznesensk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Nizhyn",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Rivne",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Chernivtsi",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Ivano-Frankivsk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Ternopil",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Lutsk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kovel",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Cherkasy",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kirovohrad",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Izmayil",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Vinnytsya",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Korosten",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Shostka",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Nikopol",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kupyansk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Lysychansk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Luhansk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Poltava",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kremenchuk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Melitopol",
      "timezone": "Europe/Zaporozhye"
    },
    {
      "city": "Zaporizhzhya",
      "timezone": "Europe/Zaporozhye"
    },
    {
      "city": "Yalta",
      "timezone": "Europe/Simferopol"
    },
    {
      "city": "Chernobyl",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Sumy",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Mariupol",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Lvov",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Odessa",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Zhytomyr",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Dnipropetrovsk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Donetsk",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Kharkiv",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Sevastapol",
      "timezone": "Europe/Simferopol"
    },
    {
      "city": "Kiev",
      "timezone": "Europe/Kiev"
    },
    {
      "city": "Umm al Qaywayn",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Sharjah",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Jabal Ali",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Ras al Khaymah",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Al Fujayrah",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Al Ayn",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Abu Dhabi",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Dubai",
      "timezone": "Asia/Dubai"
    },
    {
      "city": "Greenock",
      "timezone": "Europe/London"
    },
    {
      "city": "Sunderland",
      "timezone": "Europe/London"
    },
    {
      "city": "Southampton",
      "timezone": "Europe/London"
    },
    {
      "city": "Bristol",
      "timezone": "Europe/London"
    },
    {
      "city": "Bournemouth",
      "timezone": "Europe/London"
    },
    {
      "city": "Omagh",
      "timezone": "Europe/London"
    },
    {
      "city": "Chester",
      "timezone": "Europe/London"
    },
    {
      "city": "Swansea",
      "timezone": "Europe/London"
    },
    {
      "city": "Carlisle",
      "timezone": "Europe/London"
    },
    {
      "city": "Southend-on-Sea",
      "timezone": "Europe/London"
    },
    {
      "city": "Reading",
      "timezone": "Europe/London"
    },
    {
      "city": "Leicester",
      "timezone": "Europe/London"
    },
    {
      "city": "Bradford",
      "timezone": "Europe/London"
    },
    {
      "city": "Sheffield",
      "timezone": "Europe/London"
    },
    {
      "city": "Fort William",
      "timezone": "Europe/London"
    },
    {
      "city": "Ayr",
      "timezone": "Europe/London"
    },
    {
      "city": "Aberdeen",
      "timezone": "Europe/London"
    },
    {
      "city": "Perth",
      "timezone": "Europe/London"
    },
    {
      "city": "Dundee",
      "timezone": "Europe/London"
    },
    {
      "city": "Middlesbrough",
      "timezone": "Europe/London"
    },
    {
      "city": "Coventry",
      "timezone": "Europe/London"
    },
    {
      "city": "Bath",
      "timezone": "Europe/London"
    },
    {
      "city": "Exeter",
      "timezone": "Europe/London"
    },
    {
      "city": "Cambridge",
      "timezone": "Europe/London"
    },
    {
      "city": "Kingston upon Hull",
      "timezone": "Europe/London"
    },
    {
      "city": "Londonderry",
      "timezone": "Europe/London"
    },
    {
      "city": "Lisburn",
      "timezone": "Europe/London"
    },
    {
      "city": "Penzance",
      "timezone": "Europe/London"
    },
    {
      "city": "York",
      "timezone": "Europe/London"
    },
    {
      "city": "Blackpool",
      "timezone": "Europe/London"
    },
    {
      "city": "Dumfries",
      "timezone": "Europe/London"
    },
    {
      "city": "Scarborough",
      "timezone": "Europe/London"
    },
    {
      "city": "Plymouth",
      "timezone": "Europe/London"
    },
    {
      "city": "Ipswich",
      "timezone": "Europe/London"
    },
    {
      "city": "Norwich",
      "timezone": "Europe/London"
    },
    {
      "city": "Brighton",
      "timezone": "Europe/London"
    },
    {
      "city": "Kirkwall",
      "timezone": "Europe/London"
    },
    {
      "city": "Inverness",
      "timezone": "Europe/London"
    },
    {
      "city": "Oxford",
      "timezone": "Europe/London"
    },
    {
      "city": "Luton",
      "timezone": "Europe/London"
    },
    {
      "city": "Portsmouth",
      "timezone": "Europe/London"
    },
    {
      "city": "Peterborough",
      "timezone": "Europe/London"
    },
    {
      "city": "Nottingham",
      "timezone": "Europe/London"
    },
    {
      "city": "Stoke",
      "timezone": "Europe/London"
    },
    {
      "city": "Dover",
      "timezone": "Europe/London"
    },
    {
      "city": "Edinburgh",
      "timezone": "Europe/London"
    },
    {
      "city": "Newcastle",
      "timezone": "Europe/London"
    },
    {
      "city": "Liverpool",
      "timezone": "Europe/London"
    },
    {
      "city": "Cardiff",
      "timezone": "Europe/London"
    },
    {
      "city": "Wick",
      "timezone": "Europe/London"
    },
    {
      "city": "Leeds",
      "timezone": "Europe/London"
    },
    {
      "city": "Lerwick",
      "timezone": "Europe/London"
    },
    {
      "city": "Manchester",
      "timezone": "Europe/London"
    },
    {
      "city": "Birmingham",
      "timezone": "Europe/London"
    },
    {
      "city": "Belfast",
      "timezone": "Europe/London"
    },
    {
      "city": "Glasgow",
      "timezone": "Europe/London"
    },
    {
      "city": "London",
      "timezone": "Europe/London"
    },
    {
      "city": "Faribault",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Mankato",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Albert Lea",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Willmar",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Brainerd",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Crookston",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hardin",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Glendive",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Dillon",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Polson",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Devils Lake",
      "state_ansi": "ND",
      "timezone": "America/Chicago"
    },
    {
      "city": "Burley",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "Wallace",
      "state_ansi": "ID",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Kennewick",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Centralia",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Glendale",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Safford",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Casa Grande",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Mesa",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Lake Havasu City",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Nogales",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Berkeley",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "National City",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Mendocino",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Paso Robles",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Riverside",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Delano",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "San Mateo",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Vallejo",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Glenwood Springs",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Aurora",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Greeley",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Tonopah",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Deming",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Truth or Consequences",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Las Vegas",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Farmington",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Springfield",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Tillamook",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Ontario",
      "state_ansi": "OR",
      "timezone": "America/Boise"
    },
    {
      "city": "La Grande",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Richfield",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Nephi",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Lander",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Powell",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Paragould",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Iowa City",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Ottumwa",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Spencer",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Ft. Dodge",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hutchinson",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Kansas City",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lawrence",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Garden City",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Manhattan",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hays",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Goodland",
      "state_ansi": "KS",
      "timezone": "America/Denver"
    },
    {
      "city": "Independence",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Kirksville",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Kearney",
      "state_ansi": "NE",
      "timezone": "America/Chicago"
    },
    {
      "city": "Grand Island",
      "state_ansi": "NE",
      "timezone": "America/Chicago"
    },
    {
      "city": "Alliance",
      "state_ansi": "NE",
      "timezone": "America/Denver"
    },
    {
      "city": "Bartlesville",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Enid",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Ardmore",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "McAlester",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Stillwater",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lead",
      "state_ansi": "SD",
      "timezone": "America/Denver"
    },
    {
      "city": "Slidell",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lake Charles",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Metairie",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "New Iberia",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Bryan",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "San Marcos",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Longview",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "McAllen",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Harlingen",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Alice",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "New Braunfels",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Cleburne",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Brownwood",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Alpine",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Van Horn",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Big Spring",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Vernon",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Childress",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hereford",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Dalhart",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Texas City",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Pasadena",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Baytown",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Arlington",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "New London",
      "state_ansi": "CT",
      "timezone": "America/New_York"
    },
    {
      "city": "Stamford",
      "state_ansi": "CT",
      "timezone": "America/New_York"
    },
    {
      "city": "Waterbury",
      "state_ansi": "CT",
      "timezone": "America/New_York"
    },
    {
      "city": "New Bedford",
      "state_ansi": "MA",
      "timezone": "America/New_York"
    },
    {
      "city": "Springfield",
      "state_ansi": "MA",
      "timezone": "America/New_York"
    },
    {
      "city": "Salem",
      "state_ansi": "MA",
      "timezone": "America/New_York"
    },
    {
      "city": "Pittsfield",
      "state_ansi": "MA",
      "timezone": "America/New_York"
    },
    {
      "city": "Montpelier",
      "state_ansi": "VT",
      "timezone": "America/New_York"
    },
    {
      "city": "Auburn",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Florence",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Winter Haven",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Melbourne",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Homestead",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Sanford",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Miami Beach",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Coral Springs",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Port Charlotte",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Spring Hill",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Palm Coast",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Palatka",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Leesburg",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Lake City",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Crestview",
      "state_ansi": "FL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Panama City",
      "state_ansi": "FL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Dalton",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Marietta",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Waycross",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "La Grange",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Southaven",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Meridian",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Laurel",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Spartanburg",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Orangeburg",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Galesburg",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Joliet",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Cape Girardeau",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Rockford",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Evanston",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Rock Island",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Elgin",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Richmond",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Terre Haute",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Lafayette",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Marion",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "South Bend",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "New Albany",
      "state_ansi": "IN",
      "timezone": "America/Kentucky/Louisville"
    },
    {
      "city": "Elkhart",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Hopkinsville",
      "state_ansi": "KY",
      "timezone": "America/Chicago"
    },
    {
      "city": "London",
      "state_ansi": "KY",
      "timezone": "America/New_York"
    },
    {
      "city": "Madisonville",
      "state_ansi": "KY",
      "timezone": "America/Chicago"
    },
    {
      "city": "Rocky Mount",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Salisbury",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Durham",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Lumberton",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Zanesville",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Mansfield",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Bowling Green",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Springfield",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Lancaster",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Johnson City",
      "state_ansi": "TN",
      "timezone": "America/New_York"
    },
    {
      "city": "Kingsport",
      "state_ansi": "TN",
      "timezone": "America/New_York"
    },
    {
      "city": "Columbia",
      "state_ansi": "TN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Barlett",
      "state_ansi": "TN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Blacksburg",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Harrisonburg",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Petersburg",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Hampton",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Sheboygan",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Waukesha",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "La Crosse",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Eau Claire",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Tomah",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Janesville",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Appleton",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Parkersburg",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "White Sulphur Springs",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "Clarksburg",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "Dover",
      "state_ansi": "DE",
      "timezone": "America/New_York"
    },
    {
      "city": "St. Charles",
      "state_ansi": "MD",
      "timezone": "America/New_York"
    },
    {
      "city": "Annapolis",
      "state_ansi": "MD",
      "timezone": "America/New_York"
    },
    {
      "city": "Hagerstown",
      "state_ansi": "MD",
      "timezone": "America/New_York"
    },
    {
      "city": "Paterson",
      "state_ansi": "NJ",
      "timezone": "America/New_York"
    },
    {
      "city": "Saratoga Springs",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Poughkeepsie",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Plattsburg",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Beaver Falls",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Altoona",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Williamsport",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Lancaster",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Allentown",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Waterville",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Calais",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Houlton",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Benton Harbor",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Battle Creek",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Bay City",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Alpena",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Iron Mountain",
      "state_ansi": "MI",
      "timezone": "America/Menominee"
    },
    {
      "city": "Ironwood",
      "state_ansi": "MI",
      "timezone": "America/Menominee"
    },
    {
      "city": "Sand Point",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Hydaburg",
      "state_ansi": "AK",
      "timezone": "America/Sitka"
    },
    {
      "city": "Mekoryuk",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Atqasuk",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Port Heiden",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Perryville",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Dillingham",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Goodnews Bay",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Nyac",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Tununak",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Mountain Village",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Emmonak",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Kaltag",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Teller",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Koyukuk",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Kobuk",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Selawik",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Talkeetna",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Whittier",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Montana",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Lake Minchumina",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Cantwell",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Gulkana",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Eagle",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Nenana",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Big Delta",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Allakaket",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Tanana",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Virginia",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Winona",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Rochester",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lakeville",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Ely",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Moorhead",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "St. Cloud",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Miles City",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Bozeman",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Glasgow",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Dickinson",
      "state_ansi": "ND",
      "timezone": "America/Denver"
    },
    {
      "city": "Jamestown",
      "state_ansi": "ND",
      "timezone": "America/Chicago"
    },
    {
      "city": "Williston",
      "state_ansi": "ND",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lihue",
      "state_ansi": "HI",
      "timezone": "Pacific/Honolulu"
    },
    {
      "city": "Wahiawa",
      "state_ansi": "HI",
      "timezone": "Pacific/Honolulu"
    },
    {
      "city": "Wailuku",
      "state_ansi": "HI",
      "timezone": "Pacific/Honolulu"
    },
    {
      "city": "Montpelier",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "Twin Falls",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "Caldwell",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "Salmon",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "Coeur d'Alene",
      "state_ansi": "ID",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Richland",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Bellingham",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Longview",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Walla Walla",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Aberdeen",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Bremerton",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Everett",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Bullhead City",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Winslow",
      "state_ansi": "AZ",
      "timezone": "America/Denver"
    },
    {
      "city": "Gila Bend",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Tombstone",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Willcox",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Scottsdale",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Kingman",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Grand Canyon",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Arcata",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Stockton",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Barstow",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Victorville",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Pasadena",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Visalia",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "El Centro",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "San Luis Obispo",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Merced",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Yuba City",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Redding",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Santa Rosa",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Oceanside",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Modesto",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Irvine",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Ukiah",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Needles",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Bishop",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Palm Springs",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Santa Maria",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Tulare",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Mt. Shasta",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Crescent City",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Fort Collins",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Pueblo",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Lamar",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Trinidad",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Gunnison",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Durango",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Montrose",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Craig",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Boulder",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Boulder City",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Winnemucca",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Roswell",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Clovis",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Las Cruces",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Hobbs",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Socorro",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Gallup",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Raton",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Tucumcari",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Roseburg",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Pendleton",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "John Day",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Grants Pass",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Corvallis",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Albany",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Astoria",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Logan",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Parowan",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Kanab",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Monticello",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Moab",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Price",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Cedar City",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Vernal",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Ogden",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Green River",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Rawlins",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Douglas",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Riverton",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Thermopolis",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Gillette",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Jonesboro",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Texarkana",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Pine Bluff",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hot Springs",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Fort Smith",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Fayetteville",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Conway",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "El Dorado",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Davenport",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Burlington",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Dubuque",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Waterloo",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Sioux City",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Council Bluffs",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Ames",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Mason City",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Emporia",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Salina",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Dodge City",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Coffeyville",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "St. Charles",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Poplar Bluff",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Joplin",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Columbia",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "St. Joseph",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "McCook",
      "state_ansi": "NE",
      "timezone": "America/Chicago"
    },
    {
      "city": "Norfolk",
      "state_ansi": "NE",
      "timezone": "America/Chicago"
    },
    {
      "city": "North Platte",
      "state_ansi": "NE",
      "timezone": "America/Chicago"
    },
    {
      "city": "Sidney",
      "state_ansi": "NE",
      "timezone": "America/Denver"
    },
    {
      "city": "Scottsbluff",
      "state_ansi": "NE",
      "timezone": "America/Denver"
    },
    {
      "city": "Chadron",
      "state_ansi": "NE",
      "timezone": "America/Denver"
    },
    {
      "city": "Lawton",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Norman",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Muskogee",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Ponca City",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Shawnee",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Woodward",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Guymon",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Yankton",
      "state_ansi": "SD",
      "timezone": "America/Chicago"
    },
    {
      "city": "Brookings",
      "state_ansi": "SD",
      "timezone": "America/Chicago"
    },
    {
      "city": "Mitchell",
      "state_ansi": "SD",
      "timezone": "America/Chicago"
    },
    {
      "city": "Aberdeen",
      "state_ansi": "SD",
      "timezone": "America/Chicago"
    },
    {
      "city": "Mobridge",
      "state_ansi": "SD",
      "timezone": "America/Chicago"
    },
    {
      "city": "Houma",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Monroe",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Conroe",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Nacogdoches",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Eagle Pass",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Edinburg",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Kingsville",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Port Arthur",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Huntsville",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Killeen",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lufkin",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Del Rio",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "San Angelo",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Sherman",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Beaumont",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Bay City",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Port Lavaca",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Falfurrias",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Beeville",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Fort Stockton",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Pecos",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Dumas",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Denton",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Midland",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Temple",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "New Haven",
      "state_ansi": "CT",
      "timezone": "America/New_York"
    },
    {
      "city": "Lowell",
      "state_ansi": "MA",
      "timezone": "America/New_York"
    },
    {
      "city": "Worcester",
      "state_ansi": "MA",
      "timezone": "America/New_York"
    },
    {
      "city": "Manchester",
      "state_ansi": "NH",
      "timezone": "America/New_York"
    },
    {
      "city": "Newport",
      "state_ansi": "RI",
      "timezone": "America/New_York"
    },
    {
      "city": "Dothan",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Tuscaloosa",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Gadsden",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Enterprise",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Selma",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Coral Gables",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Cape Coral",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Naples",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Fort Pierce",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Kissimmee",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Titusville",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "St. Augustine",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Ocala",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Fort Lauderdale",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Apalachicola",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Vero Beach",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Valdosta",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Albany",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Athens",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Macon",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Columbus",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Douglas",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Dublin",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Gulfport",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hattiesburg",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Tupelo",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Greenville",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Natchez",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Florence",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Greenville",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Sumter",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Anderson",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Aiken",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Beaufort",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Rock Hill",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Decatur",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Alton",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Quincy",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Urbana",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Bloomington",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Kankakee",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Waukegan",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Aurora",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Carbondale",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Belleville",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Bloomington",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Muncie",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Kokomo",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Gary",
      "state_ansi": "IN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Fort Wayne",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Covington",
      "state_ansi": "KY",
      "timezone": "America/New_York"
    },
    {
      "city": "Bowling Green",
      "state_ansi": "KY",
      "timezone": "America/Chicago"
    },
    {
      "city": "Paducah",
      "state_ansi": "KY",
      "timezone": "America/Chicago"
    },
    {
      "city": "Owensboro",
      "state_ansi": "KY",
      "timezone": "America/Chicago"
    },
    {
      "city": "Jacksonville",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Goldsboro",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Greenville",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Fayetteville",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Hickory",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Asheville",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Winston-Salem",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Kitty Hawk",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Akron",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Lima",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Oak Ridge",
      "state_ansi": "TN",
      "timezone": "America/New_York"
    },
    {
      "city": "Murfreesboro",
      "state_ansi": "TN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Clarksville",
      "state_ansi": "TN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Jackson",
      "state_ansi": "TN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Alexandria",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Fredericksburg",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Roanoke",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Danville",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Winchester",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Bristol",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Superior",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "West Bend",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Fond du Lac",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Oshkosh",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Rhinelander",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Racine",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Marinette",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Wheeling",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "Morgantown",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "Huntington",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "Beckley",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "Wilmington",
      "state_ansi": "DE",
      "timezone": "America/New_York"
    },
    {
      "city": "Cumberland",
      "state_ansi": "MD",
      "timezone": "America/New_York"
    },
    {
      "city": "Atlantic City",
      "state_ansi": "NJ",
      "timezone": "America/New_York"
    },
    {
      "city": "Newark",
      "state_ansi": "NJ",
      "timezone": "America/New_York"
    },
    {
      "city": "Schenectady",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Binghamton",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Utica",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Watertown",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Niagara Falls",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Jamestown",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Elmira",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "York",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Johnstown",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Scranton",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "State College",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Erie",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Wilkes Barre",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Bar Harbor",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Lewiston",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Presque Isle",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Ann Arbor",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Kalamazoo",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Muskegon",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Flint",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Grand Rapids",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Pontiac",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Cadillac",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Traverse City",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Petoskey",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Escanaba",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Marquette",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Hancock",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Wrangell",
      "state_ansi": "AK",
      "timezone": "America/Sitka"
    },
    {
      "city": "Shishmaref",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Hoonah",
      "state_ansi": "AK",
      "timezone": "America/Juneau"
    },
    {
      "city": "Atka",
      "state_ansi": "AK",
      "timezone": "America/Adak"
    },
    {
      "city": "Nikolski",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Karluk",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "False Pass",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Kivalina",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Newhalen",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Pilot Point",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Chignik",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "King Salmon",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Quinhagak",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Aniak",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Kotlit",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Unalakleet",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Koyuk",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "McGrath",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Hughes",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Ambler",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Wales",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Kotzebue",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Wasilla",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Circle",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Denali Park",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Yakutat",
      "state_ansi": "AK",
      "timezone": "America/Yakutat"
    },
    {
      "city": "Homer",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Tanacross",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Wiseman",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Kailua-Kona",
      "state_ansi": "HI",
      "timezone": "Pacific/Honolulu"
    },
    {
      "city": "Butte",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Grand Forks",
      "state_ansi": "ND",
      "timezone": "America/Chicago"
    },
    {
      "city": "Pocatello",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "Tacoma",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Yuma",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Prescott",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Long Beach",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Grand Junction",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Ely",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Carson City",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Carlsbad",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Alamogordo",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Medford",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Klamath Falls",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "St. George",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Provo",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Laramie",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Little Rock",
      "state_ansi": "AR",
      "timezone": "America/Chicago"
    },
    {
      "city": "Wichita",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Jefferson City",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Rapid City",
      "state_ansi": "SD",
      "timezone": "America/Denver"
    },
    {
      "city": "Lafayette",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Galveston",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Freeport",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Victoria",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Odessa",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Wichita Falls",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Waco",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lubbock",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hartford",
      "state_ansi": "CT",
      "timezone": "America/New_York"
    },
    {
      "city": "Providence",
      "state_ansi": "RI",
      "timezone": "America/New_York"
    },
    {
      "city": "Birmingham",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Mobile",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Pensacola",
      "state_ansi": "FL",
      "timezone": "America/Chicago"
    },
    {
      "city": "St. Petersburg",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Biloxi",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Springfield",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Frankfort",
      "state_ansi": "KY",
      "timezone": "America/New_York"
    },
    {
      "city": "Greensboro",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Dayton",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Virginia Beach",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Madison",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Green Bay",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Trenton",
      "state_ansi": "NJ",
      "timezone": "America/New_York"
    },
    {
      "city": "Lansing",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Gambell",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Palmer",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Seward",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Duluth",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Bemidji",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Havre",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Kalispell",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Idaho Falls",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "Lewiston",
      "state_ansi": "ID",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Yakima",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Wenatchee",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Douglas",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Bakersfield",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Oakland",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Lancaster",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Chico",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Monterey",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Salinas",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Los Alamos",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Eugene",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Coos Bay",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Bend",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Cody",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Cedar Rapids",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Springfield",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Lincoln",
      "state_ansi": "NE",
      "timezone": "America/Chicago"
    },
    {
      "city": "Alexandria",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Abilene",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Brownsville",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Tyler",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Concord",
      "state_ansi": "NH",
      "timezone": "America/New_York"
    },
    {
      "city": "Huntsville",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Key West",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "West Palm Beach",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Sarasota",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Daytona Beach",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Gainesville",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Ft. Myers",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Brunswick",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Augusta",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Vicksburg",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Myrtle Beach",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Charleston",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Peoria",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Evansville",
      "state_ansi": "IN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Louisville",
      "state_ansi": "KY",
      "timezone": "America/Kentucky/Louisville"
    },
    {
      "city": "Lexington",
      "state_ansi": "KY",
      "timezone": "America/New_York"
    },
    {
      "city": "Charlotte",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Youngstown",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Canton",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Toledo",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Columbus",
      "exactCity": "Columbus",
      "exactProvince": "OH",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Chattanooga",
      "state_ansi": "TN",
      "timezone": "America/New_York"
    },
    {
      "city": "Charlottesville",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Lynchburg",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Wausau",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Albany",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Ithaca",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Harrisburg",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Bangor",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Portland",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Saginaw",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Ketchikan",
      "state_ansi": "AK",
      "timezone": "America/Sitka"
    },
    {
      "city": "Unalaska",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Togiak",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Red Devil",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Hooper Bay",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Wainwright",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Galena",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Kaktovik",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Skagway",
      "state_ansi": "AK",
      "timezone": "America/Juneau"
    },
    {
      "city": "Cordova",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Kenai",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Fort Yukon",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Santa Cruz",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "San Bernardino",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Bridgeport",
      "state_ansi": "CT",
      "timezone": "America/New_York"
    },
    {
      "city": "Rochester",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "International Falls",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "St. Paul",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Billings",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Great Falls",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Missoula",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Minot",
      "state_ansi": "ND",
      "timezone": "America/Chicago"
    },
    {
      "city": "Fargo",
      "state_ansi": "ND",
      "timezone": "America/Chicago"
    },
    {
      "city": "Hilo",
      "state_ansi": "HI",
      "timezone": "Pacific/Honolulu"
    },
    {
      "city": "Olympia",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Spokane",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Vancouver",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Flagstaff",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Tucson",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "Santa Barbara",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Fresno",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Eureka",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Colorado Springs",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Reno",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Elko",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Albuquerque",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Salem",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Casper",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Topeka",
      "state_ansi": "KS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Kansas City",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "Tulsa",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Sioux Falls",
      "state_ansi": "SD",
      "timezone": "America/Chicago"
    },
    {
      "city": "Shreveport",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Baton Rouge",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Ft. Worth",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Corpus Christi",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Austin",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Amarillo",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "El Paso",
      "state_ansi": "TX",
      "timezone": "America/Denver"
    },
    {
      "city": "Laredo",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Burlington",
      "state_ansi": "VT",
      "timezone": "America/New_York"
    },
    {
      "city": "Montgomery",
      "state_ansi": "AL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Tallahassee",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Orlando",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Jacksonville",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Savannah",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Columbia",
      "state_ansi": "SC",
      "timezone": "America/New_York"
    },
    {
      "city": "Indianapolis",
      "state_ansi": "IN",
      "timezone": "America/Indiana/Indianapolis"
    },
    {
      "city": "Wilmington",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Knoxville",
      "state_ansi": "TN",
      "timezone": "America/New_York"
    },
    {
      "city": "Richmond",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Charleston",
      "state_ansi": "WV",
      "timezone": "America/New_York"
    },
    {
      "city": "Baltimore",
      "state_ansi": "MD",
      "timezone": "America/New_York"
    },
    {
      "city": "Syracuse",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Augusta",
      "state_ansi": "ME",
      "timezone": "America/New_York"
    },
    {
      "city": "Sault Ste. Marie",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Sitka",
      "state_ansi": "AK",
      "timezone": "America/Sitka"
    },
    {
      "city": "Helena",
      "state_ansi": "MT",
      "timezone": "America/Denver"
    },
    {
      "city": "Bismarck",
      "state_ansi": "ND",
      "timezone": "America/Chicago"
    },
    {
      "city": "Boise",
      "state_ansi": "ID",
      "timezone": "America/Boise"
    },
    {
      "city": "San Jose",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Sacramento",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Las Vegas",
      "state_ansi": "NV",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Santa Fe",
      "state_ansi": "NM",
      "timezone": "America/Denver"
    },
    {
      "city": "Portland",
      "state_ansi": "OR",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Salt Lake City",
      "state_ansi": "UT",
      "timezone": "America/Denver"
    },
    {
      "city": "Cheyenne",
      "state_ansi": "WY",
      "timezone": "America/Denver"
    },
    {
      "city": "Des Moines",
      "state_ansi": "IA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Omaha",
      "state_ansi": "NE",
      "timezone": "America/Chicago"
    },
    {
      "city": "Oklahoma City",
      "state_ansi": "OK",
      "timezone": "America/Chicago"
    },
    {
      "city": "Pierre",
      "state_ansi": "SD",
      "timezone": "America/Chicago"
    },
    {
      "city": "San Antonio",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Jackson",
      "state_ansi": "MS",
      "timezone": "America/Chicago"
    },
    {
      "city": "Raleigh",
      "state_ansi": "NC",
      "timezone": "America/New_York"
    },
    {
      "city": "Cleveland",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Cincinnati",
      "state_ansi": "OH",
      "timezone": "America/New_York"
    },
    {
      "city": "Nashville",
      "state_ansi": "TN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Memphis",
      "state_ansi": "TN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Norfolk",
      "state_ansi": "VA",
      "timezone": "America/New_York"
    },
    {
      "city": "Milwaukee",
      "state_ansi": "WI",
      "timezone": "America/Chicago"
    },
    {
      "city": "Buffalo",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Pittsburgh",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Kodiak",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Cold Bay",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Bethel",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Point Hope",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Barrow",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Nome",
      "state_ansi": "AK",
      "timezone": "America/Nome"
    },
    {
      "city": "Valdez",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Juneau",
      "state_ansi": "AK",
      "timezone": "America/Juneau"
    },
    {
      "city": "Fairbanks",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Prudhoe Bay",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "Minneapolis",
      "state_ansi": "MN",
      "timezone": "America/Chicago"
    },
    {
      "city": "Honolulu",
      "state_ansi": "HI",
      "timezone": "Pacific/Honolulu"
    },
    {
      "city": "Seattle",
      "state_ansi": "WA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Phoenix",
      "state_ansi": "AZ",
      "timezone": "America/Phoenix"
    },
    {
      "city": "San Diego",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "St. Louis",
      "state_ansi": "MO",
      "timezone": "America/Chicago"
    },
    {
      "city": "New Orleans",
      "state_ansi": "LA",
      "timezone": "America/Chicago"
    },
    {
      "city": "Dallas",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Boston",
      "state_ansi": "MA",
      "timezone": "America/New_York"
    },
    {
      "city": "Tampa",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Philadelphia",
      "state_ansi": "PA",
      "timezone": "America/New_York"
    },
    {
      "city": "Detroit",
      "state_ansi": "MI",
      "timezone": "America/Detroit"
    },
    {
      "city": "Anchorage",
      "state_ansi": "AK",
      "timezone": "America/Anchorage"
    },
    {
      "city": "San Francisco",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Denver",
      "state_ansi": "CO",
      "timezone": "America/Denver"
    },
    {
      "city": "Houston",
      "state_ansi": "TX",
      "timezone": "America/Chicago"
    },
    {
      "city": "Miami",
      "state_ansi": "FL",
      "timezone": "America/New_York"
    },
    {
      "city": "Atlanta",
      "state_ansi": "GA",
      "timezone": "America/New_York"
    },
    {
      "city": "Chicago",
      "exactCity": "Chicago",
      "exactProvince": "IL",
      "state_ansi": "IL",
      "timezone": "America/Chicago"
    },
    {
      "city": "Los Angeles",
      "state_ansi": "CA",
      "timezone": "America/Los_Angeles"
    },
    {
      "city": "Washington, D.C.",
      "timezone": "America/New_York"
    },
    {
      "city": "New York",
      "state_ansi": "NY",
      "timezone": "America/New_York"
    },
    {
      "city": "Christiansted",
      "state_ansi": "VI",
      "timezone": "America/St_Thomas"
    },
    {
      "city": "Colonia del Sacramento",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Trinidad",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Fray Bentos",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Canelones",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Florida",
      "state_ansi": "FL",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Artigas",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Baltasar Brum",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Tranqueras",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Tacuarembo",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Paso de los Toros",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Vergara",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Treinta y Tres",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Santa Lucia",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Jose Batlle y Ordonez",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Minas",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Maldonado",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Punta del Este",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Aigua",
      "timezone": "America/Montevideo"
    },
    {
      "city": "La Paloma",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Carmelo",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Bella Union",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Mercedes",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Melo",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Rivera",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Lascano",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Castillos",
      "timezone": "America/Montevideo"
    },
    {
      "city": "San Jose de Mayo",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Rocha",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Paysandu",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Salto",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Durazno",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Montevideo",
      "timezone": "America/Montevideo"
    },
    {
      "city": "Khujayli",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Urgut",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Kattaqorgon",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Denow",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Guliston",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Iskandar",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Chirchiq",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Kogon",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Khiwa",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Chimboy",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Qunghirot",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Zarafshon",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Navoi",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Shahrisabz",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Qarshi",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Qoqon",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Jizzax",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Angren",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Olmaliq",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Muynoq",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Termiz",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Fargona",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Namangan",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Urgentch",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Bukhara",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Nukus",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Andijon",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Samarqand",
      "timezone": "Asia/Samarkand"
    },
    {
      "city": "Tashkent",
      "timezone": "Asia/Tashkent"
    },
    {
      "city": "Luganville",
      "timezone": "Pacific/Efate"
    },
    {
      "city": "Port Vila",
      "timezone": "Pacific/Efate"
    },
    {
      "city": "Vatican City",
      "timezone": "Europe/Rome"
    },
    {
      "city": "San Carlos",
      "timezone": "America/Caracas"
    },
    {
      "city": "San Felipe",
      "timezone": "America/Caracas"
    },
    {
      "city": "San Juan De Los Morros",
      "timezone": "America/Caracas"
    },
    {
      "city": "La Asuncion",
      "timezone": "America/Caracas"
    },
    {
      "city": "Guasdualito",
      "timezone": "America/Caracas"
    },
    {
      "city": "Barinas",
      "timezone": "America/Caracas"
    },
    {
      "city": "Valera",
      "timezone": "America/Caracas"
    },
    {
      "city": "Cabimas",
      "timezone": "America/Caracas"
    },
    {
      "city": "Carora",
      "timezone": "America/Caracas"
    },
    {
      "city": "Guanare",
      "timezone": "America/Caracas"
    },
    {
      "city": "Puerto la Cruz",
      "timezone": "America/Caracas"
    },
    {
      "city": "Anaco",
      "timezone": "America/Caracas"
    },
    {
      "city": "Los Teques",
      "timezone": "America/Caracas"
    },
    {
      "city": "Valle de la Pascua",
      "timezone": "America/Caracas"
    },
    {
      "city": "Ocumare del Tuy",
      "timezone": "America/Caracas"
    },
    {
      "city": "Carupano",
      "timezone": "America/Caracas"
    },
    {
      "city": "Trujillo",
      "timezone": "America/Caracas"
    },
    {
      "city": "Santa Rita",
      "timezone": "America/Caracas"
    },
    {
      "city": "Machiques",
      "timezone": "America/Caracas"
    },
    {
      "city": "San Carlos del Zulia",
      "timezone": "America/Caracas"
    },
    {
      "city": "Puerto Cabello",
      "timezone": "America/Caracas"
    },
    {
      "city": "Acarigua",
      "timezone": "America/Caracas"
    },
    {
      "city": "Upata",
      "timezone": "America/Caracas"
    },
    {
      "city": "El Manteco",
      "timezone": "America/Caracas"
    },
    {
      "city": "Chaguaramas",
      "timezone": "America/Caracas"
    },
    {
      "city": "Barcelona",
      "timezone": "America/Caracas"
    },
    {
      "city": "El Tigre",
      "timezone": "America/Caracas"
    },
    {
      "city": "Maiquetia",
      "timezone": "America/Caracas"
    },
    {
      "city": "Calabozo",
      "timezone": "America/Caracas"
    },
    {
      "city": "Zaraza",
      "timezone": "America/Caracas"
    },
    {
      "city": "Altagracia de Orituco",
      "timezone": "America/Caracas"
    },
    {
      "city": "Tucupita",
      "timezone": "America/Caracas"
    },
    {
      "city": "Porlamar",
      "timezone": "America/Caracas"
    },
    {
      "city": "San Fernando de Apure",
      "timezone": "America/Caracas"
    },
    {
      "city": "Barquisimeto",
      "timezone": "America/Caracas"
    },
    {
      "city": "Maturin",
      "timezone": "America/Caracas"
    },
    {
      "city": "Cumana",
      "timezone": "America/Caracas"
    },
    {
      "city": "Coro",
      "timezone": "America/Caracas"
    },
    {
      "city": "Punto Fijo",
      "timezone": "America/Caracas"
    },
    {
      "city": "La Esmeralda",
      "timezone": "America/Caracas"
    },
    {
      "city": "Ciudad Bolivar",
      "timezone": "America/Caracas"
    },
    {
      "city": "El Dorado",
      "timezone": "America/Caracas"
    },
    {
      "city": "Maracay",
      "timezone": "America/Caracas"
    },
    {
      "city": "Merida",
      "timezone": "America/Caracas"
    },
    {
      "city": "Puerto Ayacucho",
      "timezone": "America/Caracas"
    },
    {
      "city": "San Cristobal",
      "timezone": "America/Caracas"
    },
    {
      "city": "Valencia",
      "timezone": "America/Caracas"
    },
    {
      "city": "Ciudad Guayana",
      "timezone": "America/Caracas"
    },
    {
      "city": "Maracaibo",
      "timezone": "America/Caracas"
    },
    {
      "city": "Caracas",
      "timezone": "America/Caracas"
    },
    {
      "city": "Tay Ninh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Luan Chau",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Bac Kan",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Lang Son",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Son La",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Tuyen Quang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Yen Bai",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Hai Duong",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Thai Binh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Tuy Hoa",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Thu Dau Mot",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Dong Ha",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Cao Lanh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Truc Giang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Tra Vinh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Vinh Long",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Cao Bang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Hong Gai",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Cam Pha",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Lao Chi",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Hoa Binh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Son Tay",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Ninh Binh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Viet Tri",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Bac Giang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Ha Tinh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Buon Me Thuot",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Da Lat",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Phan Rang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Hon Quan",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Kon Tum",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Quang Ngai",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Quang Tri",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Vung Tau",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Phan Thiet",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Long Xuyen",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Chau Doc",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Rach Gia",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Tan An",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "My Tho",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Bac Lieu",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Ca Mau",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Soc Trang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Ha Giang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Thai Nguyen",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Thanh Hoa",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Nam Dinh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Vinh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Dong Hoi",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Play Ku",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Nha Trang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Cam Ranh",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Qui Nhon",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Hue",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Bien Hoa",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Can Tho",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Haiphong",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Da Nang",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Hanoi",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Ho Chi Minh City",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    {
      "city": "Bir Lehlou",
      "timezone": "Africa/El_Aaiun"
    },
    {
      "city": "Al Bayda",
      "timezone": "Asia/Aden"
    },
    {
      "city": "'Ataq",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Marib",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Dhamar",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Ibb",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Ash Shihr",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Zabid",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Hajjah",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Lahij",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Al Ghaydah",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Rida",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Hadiboh",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Saywun",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Sadah",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Al Hudaydah",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Sayhut",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Al Mukalla",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Taizz",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Aden",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Sanaa",
      "timezone": "Asia/Aden"
    },
    {
      "city": "Kawambwa",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Nchelenge",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Chinsali",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kasama",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kapiri Mposhi",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mumbwa",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Chingola",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Chililabombwe",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Nyimba",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Lundazi",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Chipata",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mwinilunga",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kasempa",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Solwezi",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Choma",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mongu",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kaoma",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Sesheke",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Lukulu",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kalabo",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Senanga",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mansa",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mpika",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mbala",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Luanshya",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Ndola",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Zambezi",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kafue",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mazabuka",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kabwe",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mufulira",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Kitwe",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Livingstone",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Lusaka",
      "timezone": "Africa/Lusaka"
    },
    {
      "city": "Mazowe",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Shamva",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Victoria Falls",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Zvishavane",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Kwekwe",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Plumtree",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Beitbridge",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Gwanda",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Chiredzi",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Masvingo",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Karoi",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Chinhoyi",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Kariba",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Hwange",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Gweru",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Mutare",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Kadoma",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Chitungwiza",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Harare",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Bulawayo",
      "timezone": "Africa/Harare"
    },
    {
      "city": "Copenhagen",
      "timezone": "Europe/Copenhagen"
    },
    {
      "city": "Oakleigh",
      "timezone": "Australia/Melbourne"
    },
    {
      "city": "Oak Park", "state_ansi": "IL",
      "timezone": "America/Chicago"
    }
  ]

  useEffect(() => {
    const fetchTime = async () => {
      setTime(new Date().toLocaleString('en-US', { timeZone: city }));
    }
    fetchTime()
  }, [city])

  return (
    <div className={styles.container}>
      <Head>
        <title>What Time Is It?</title>
        <meta name="description" content="What time is it right now in any city?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>What Time Is It?</h1>
        <p>It is currently {time}</p>

        <select onChange={(e) => setCity(e.target.value)}>
          {cities.map((city) => (
            <option key={city.city} value={city.timezone}>{city.city}</option>
          ))}
        </select>
      </main>
    </div>
  )
}