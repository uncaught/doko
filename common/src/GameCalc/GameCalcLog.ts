export const logTexts = {
  re_won_with_1_points: 'Re-Partei hat mit einem Stich gewonnen (Kontra hat "schwarz" abgesagt)',
  re_won_with_30_points: 'Re-Partei hat mit dem 30. Auge gewonnen (Kontra hat "keine 3" abgesagt)',
  re_won_with_60_points: 'Re-Partei hat mit dem 60. Auge gewonnen (Kontra hat "keine 6" abgesagt)',
  re_won_with_90_points: 'Re-Partei hat mit dem 90. Auge gewonnen (Kontra hat "keine 9" abgesagt)',
  re_won_with_120_points: 'Re-Partei hat mit dem 120. Auge gewonnen (nur Kontra angesagt)',
  re_won_with_121_points: 'Re-Partei hat mit dem 121. Auge gewonnen',
  re_won_with_151_points: 'Re-Partei hat mit dem 151. Auge gewonnen ("keine 9" abgesagt)',
  re_won_with_181_points: 'Re-Partei hat mit dem 181. Auge gewonnen ("keine 6" abgesagt)',
  re_won_with_211_points: 'Re-Partei hat mit dem 211. Auge gewonnen ("keine 3" abgesagt)',
  re_won_with_240_points: 'Re-Partei hat mit allen Stichen gewonnen ("schwarz" abgesagt)',

  contra_won_with_1_points: 'Contra-Partei hat mit einem Stich gewonnen (Re hat "schwarz" abgesagt)',
  contra_won_with_30_points: 'Contra-Partei hat mit dem 30. Auge gewonnen (Re hat "keine 3" abgesagt)',
  contra_won_with_60_points: 'Contra-Partei hat mit dem 60. Auge gewonnen (Re hat "keine 6" abgesagt)',
  contra_won_with_90_points: 'Contra-Partei hat mit dem 90. Auge gewonnen (Re hat "keine 9" abgesagt)',
  contra_won_with_120_points: 'Contra-Partei hat mit dem 120. Auge gewonnen',
  contra_won_with_121_points: 'Contra-Partei hat mit dem 121. Auge gewonnen (nur Kontra angesagt)',
  contra_won_with_151_points: 'Contra-Partei hat mit dem 151. Auge gewonnen ("keine 9" abgesagt)',
  contra_won_with_181_points: 'Contra-Partei hat mit dem 181. Auge gewonnen ("keine 6" abgesagt)',
  contra_won_with_211_points: 'Contra-Partei hat mit dem 211. Auge gewonnen ("keine 3" abgesagt)',
  contra_won_with_240_points: 'Contra-Partei hat mit allen Stichen gewonnen ("schwarz" abgesagt)',

  no_party_won: 'Keine Partei hat gewonnen',

  re_announced: 'Re wurde angesagt',
  contra_announced: 'Contra wurde angesagt',

  re_min_151: 'Re hat Contra unter 90 gespielt',
  re_min_181: 'Re hat Contra unter 60 gespielt',
  re_min_211: 'Re hat Contra unter 30 gespielt',
  re_min_240: 'Re hat Contra schwarz gespielt',

  contra_min_151: 'Contra hat Re unter 90 gespielt',
  contra_min_181: 'Contra hat Re unter 60 gespielt',
  contra_min_211: 'Contra hat Re unter 30 gespielt',
  contra_min_240: 'Contra hat Re schwarz gespielt',

  re_no9: 'Re hat "keine 9" abgesagt',
  re_no6: 'Re hat "keine 6" abgesagt',
  re_no3: 'Re hat "keine 3" abgesagt',
  re_no0: 'Re hat "schwarz" abgesagt',

  contra_no9: 'Contra hat "keine 9" abgesagt',
  contra_no6: 'Contra hat "keine 6" abgesagt',
  contra_no3: 'Contra hat "keine 3" abgesagt',
  contra_no0: 'Contra hat "schwarz" abgesagt',

  re_120_against_no9: 'Re hat 120 Augen gegen "keine 9" erreicht',
  re_90_against_no6: 'Re hat 120 Augen gegen "keine 6" erreicht',
  re_60_against_no3: 'Re hat 120 Augen gegen "keine 3" erreicht',
  re_30_against_no0: 'Re hat 120 Augen gegen "schwarz" erreicht',

  contra_120_against_no9: 'Contra hat 120 Augen gegen "keine 9" erreicht',
  contra_90_against_no6: 'Contra hat 120 Augen gegen "keine 6" erreicht',
  contra_60_against_no3: 'Contra hat 120 Augen gegen "keine 3" erreicht',
  contra_30_against_no0: 'Contra hat 120 Augen gegen "schwarz" erreicht',

  bock_double_game_points: 'Bock: Verdopplung der Spielpunkte',
  bock_double_game_and_extra_points: 'Bock: Verdopplung der Spiel- und Sonderpunkte',
  bock_extra_points: 'Bock-Sonderpunkte',

  re_extra_point_doppelkopf: 'Doppelkopf für Re-Partei',
  re_extra_point_foxCaught: 'Fuchs von Contra-Partei gefangen',
  re_extra_point_karlGotLastTrick: 'Karlchen hat den letzten Stich für Re-Partei gemacht',
  re_extra_point_karlCaught: 'Karlchen im letzten Stich von Contra-Partei gefangen',

  contra_extra_point_wonAgainstQueensOfClubs: 'Gegen die Alten',
  contra_extra_point_doppelkopf: 'Doppelkopf für Contra-Partei',
  contra_extra_point_foxCaught: 'Fuchs von Re-Partei gefangen',
  contra_extra_point_karlGotLastTrick: 'Karlchen hat den letzten Stich für Contra-Partei gemacht',
  contra_extra_point_karlCaught: 'Karlchen im letzten Stich von Re-Partei gefangen',
};

export type GameCalcLogKey = keyof typeof logTexts;
export type GameCalcLog = GameCalcLogKey[];
