/* ============================================================
   seed.js — default exercise library, workout templates, schedule
   Schema: 5-day PPL + KB hybrid
   Ma Push · Di Pull · Wo Legs · Do Rust · Vr KB Upper · Za KB Lower
   ============================================================ */

const Seed = (() => {

  // ---- Exercise library -------------------------------------------------
  // weightUnit: 'per_dumbbell' | 'totaal' | 'barbell' | 'machine' | 'bodyweight' | 'kettlebell'
  const exercises = [
    // ── PUSH exercises ────────────────────────────────────────────────────
    { id: 'ex_incline_bb_bench', name: 'Incline Barbell Bench Press', category: 'Push', primaryMuscle: 'Borst (boven)', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Barbell, bank', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '6-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Bank op 30-45°. Stang naar boven op de borst, volledige lock-out.', cues: 'Schouderbladen samen en naar beneden, voeten stevig geplant.', mistakes: 'Te steile bankhoek, stuiteren op de borst.', alternatives: ['ex_incline_db_bench'] },
    { id: 'ex_incline_db_bench', name: 'Incline Dumbbell Bench Press', category: 'Push', primaryMuscle: 'Borst (boven)', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Dumbbells, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '6-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Bank op 30-45°. Dumbbells vanaf de borst naar boven drukken.', cues: 'Pols recht boven elleboog, gecontroleerde afdaling.', mistakes: 'Gewichten laten botsen bovenaan.', alternatives: ['ex_incline_bb_bench'] },
    { id: 'ex_flat_db_bench', name: 'Flat Dumbbell Bench Press', category: 'Push', primaryMuscle: 'Borst', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Dumbbells, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Vlakke bank, dumbbells vanaf borsthoogte naar boven drukken.', cues: 'Lichte boog, ellebogen niet volledig locken.', mistakes: 'Te snel excentrisch bewegen.', alternatives: ['ex_chest_press_machine'] },
    { id: 'ex_chest_press_machine', name: 'Machine Chest Press', category: 'Push', primaryMuscle: 'Borst', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Handvatten recht naar voren drukken.', cues: 'Schouderbladen ingedrukt op de rugsteun.', mistakes: 'Handvatten laten uitwijken.', alternatives: ['ex_flat_db_bench'] },
    { id: 'ex_ohp', name: 'Standing Barbell Overhead Press', category: 'Push', primaryMuscle: 'Schouders', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Barbell', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '5-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Stang vanaf de schouders recht naar boven drukken.', cues: 'Billen aanspannen, hoofd licht door onder de stang.', mistakes: 'Overmatig doorbuigen in de onderrug.', alternatives: ['ex_db_shoulder_press'] },
    { id: 'ex_db_shoulder_press', name: 'Dumbbell Shoulder Press', category: 'Push', primaryMuscle: 'Schouders', secondaryMuscles: ['Triceps'], equipment: 'Dumbbells', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 120, instructions: 'Zittend of staand, dumbbells recht naar boven drukken.', cues: 'Ellebogen licht voor het lichaam houden.', mistakes: 'Te zware gewichten, schouders optrekken.', alternatives: ['ex_ohp'] },
    { id: 'ex_lateral_raise', name: 'Lateral Raise', category: 'Isolatie', primaryMuscle: 'Zijdelingse schouders', secondaryMuscles: [], equipment: 'Dumbbells of kabel', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Armen zijwaarts heffen tot schouderhoogte.', cues: 'Lichte buiging in de elleboog, leiden met de ellebogen.', mistakes: 'Momentum gebruiken vanuit de heupen.', alternatives: [] },
    { id: 'ex_triceps_pushdown', name: 'Triceps Pushdown', category: 'Isolatie', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Kabelmachine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Ellebogen bij de romp, onderarmen naar beneden drukken.', cues: 'Volledige extensie onderaan.', mistakes: 'Ellebogen laten wegzwaaien.', alternatives: ['ex_ov_triceps_ext'] },
    { id: 'ex_ov_triceps_ext', name: 'Overhead Triceps Extension', category: 'Isolatie', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Dumbbell of kabel', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Gewicht achter het hoofd strekken.', cues: 'Ellebogen dicht bij het hoofd houden.', mistakes: 'Ellebogen laten uitwaaieren.', alternatives: ['ex_triceps_pushdown'] },

    // ── PULL exercises ───────────────────────────────────────────────────
    { id: 'ex_lat_pulldown', name: 'Lat Pulldown', category: 'Pull', primaryMuscle: 'Rug (lats)', secondaryMuscles: ['Biceps'], equipment: 'Kabelmachine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Stang naar de bovenborst trekken, ellebogen naar beneden en achteren.', cues: 'Borst omhoog, geen momentum met de rug.', mistakes: 'Te ver achterover leunen.', alternatives: ['ex_assisted_pullup'] },
    { id: 'ex_assisted_pullup', name: 'Assisted Pull-up', category: 'Pull', primaryMuscle: 'Rug (lats)', secondaryMuscles: ['Biceps'], equipment: 'Pull-up machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Volledige range, kin boven de stang.', cues: 'Actief de schouderbladen naar beneden trekken bij start.', mistakes: 'Halve reps.', alternatives: ['ex_lat_pulldown'] },
    { id: 'ex_chest_supported_row', name: 'Chest Supported Dumbbell Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps', 'Achterste schouders'], equipment: 'Dumbbells, schuine bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 120, instructions: 'Borst op schuine bank, dumbbells naar de heupen trekken.', cues: 'Schouderbladen samenknijpen bovenaan.', mistakes: 'Rug bollen.', alternatives: ['ex_seated_cable_row'] },
    { id: 'ex_oneam_db_row', name: 'One-arm Dumbbell Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps'], equipment: 'Dumbbell, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Knie en hand op de bank, dumbbell naar de heup trekken.', cues: 'Romp stabiel, geen rotatie.', mistakes: 'Ruk-beweging.', alternatives: ['ex_seated_cable_row'] },
    { id: 'ex_seated_cable_row', name: 'Seated Cable Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps'], equipment: 'Kabelmachine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Handvat naar de buik trekken, rug rechtop.', cues: 'Schouderbladen samenknijpen op het einde.', mistakes: 'Achterover leunen om te trekken.', alternatives: ['ex_oneam_db_row'] },
    { id: 'ex_rear_delt_fly', name: 'Rear Delt Fly', category: 'Isolatie', primaryMuscle: 'Achterste schouders', secondaryMuscles: ['Bovenrug'], equipment: 'Dumbbells of machine', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Licht voorover, armen zijwaarts-achterwaarts openen.', cues: 'Kleine range, focus op de achterste schouder.', mistakes: 'Te zwaar gewicht, momentum.', alternatives: ['ex_face_pull'] },
    { id: 'ex_face_pull', name: 'Face Pull', category: 'Isolatie', primaryMuscle: 'Achterste schouders', secondaryMuscles: ['Bovenrug'], equipment: 'Kabelmachine, touw', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Touw naar het gezicht trekken, ellebogen hoog.', cues: 'Handen eindigen naast de oren.', mistakes: 'Te zwaar, korte range.', alternatives: ['ex_rear_delt_fly'] },
    { id: 'ex_incline_db_curl', name: 'Incline Dumbbell Curl', category: 'Isolatie', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'Dumbbells, schuine bank', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Op schuine bank, armen volledig strekken en curlen.', cues: 'Ellebogen achter de romp houden.', mistakes: 'Schouders mee optrekken.', alternatives: ['ex_cable_curl'] },
    { id: 'ex_cable_curl', name: 'Cable Curl', category: 'Isolatie', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'Kabelmachine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Constante spanning, volledige curl.', cues: 'Ellebogen bij de romp.', mistakes: 'Schouders meebewegen.', alternatives: ['ex_incline_db_curl'] },

    // ── LEGS exercises ───────────────────────────────────────────────────
    { id: 'ex_back_squat', name: 'Back Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren', 'Core'], equipment: 'Barbell, rek', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '5-8', defaultRir: '1-2', defaultRest: 165, instructions: 'Stang op de bovenrug, diep zakken tot minstens parallel.', cues: 'Knieën in lijn met de tenen, borst omhoog.', mistakes: 'Knieën naar binnen laten zakken.', alternatives: ['ex_hack_squat'] },
    { id: 'ex_hack_squat', name: 'Hack Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 120, instructions: 'Rug tegen de rugsteun, diep zakken en drukken.', cues: 'Volledige voetzool op de plaat.', mistakes: 'Hielen optillen.', alternatives: ['ex_back_squat'] },
    { id: 'ex_rdl', name: 'Romanian Deadlift', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Bilspieren', 'Onderrug'], equipment: 'Barbell', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 150, instructions: 'Heupen naar achteren, stang dicht bij de benen, rug neutraal.', cues: 'Lichte kniebuiging, rek voelen in de hamstrings.', mistakes: 'Rug ronden.', alternatives: [] },
    { id: 'ex_bulgarian_split_squat', name: 'Bulgarian Split Squat', category: 'Unilateraal', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren'], equipment: 'Dumbbells, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12 per been', defaultRir: '1-2', defaultRest: 105, instructions: 'Achterste voet verhoogd, recht naar beneden zakken.', cues: 'Romp rechtop, gewicht op de voorste hiel.', mistakes: 'Te ver naar voren leunen.', alternatives: [] },
    { id: 'ex_leg_curl', name: 'Leg Curl', category: 'Isolatie', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-2', defaultRest: 75, instructions: 'Hielen naar de bilspieren curlen.', cues: 'Gecontroleerd terug laten zakken.', mistakes: 'Heupen optillen.', alternatives: ['ex_seated_leg_curl'] },
    { id: 'ex_seated_leg_curl', name: 'Seated Leg Curl', category: 'Isolatie', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-2', defaultRest: 75, instructions: 'Zittend, hielen naar beneden curlen.', cues: 'Volledige range.', mistakes: 'Heupen optillen.', alternatives: ['ex_leg_curl'] },
    { id: 'ex_leg_extension', name: 'Leg Extension', category: 'Isolatie', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Onderbenen strekken tot bijna volledige extensie.', cues: 'Korte pauze bovenaan.', mistakes: 'Te snel laten terugvallen.', alternatives: [] },
    { id: 'ex_standing_calf_raise', name: 'Standing Calf Raise', category: 'Isolatie', primaryMuscle: 'Kuiten', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-20', defaultRir: '0-1', defaultRest: 60, instructions: 'Volledige range: diepe stretch tot volledig op de tenen.', cues: 'Even pauzeren bovenaan.', mistakes: 'Halve range.', alternatives: ['ex_seated_calf_raise'] },
    { id: 'ex_seated_calf_raise', name: 'Seated Calf Raise', category: 'Isolatie', primaryMuscle: 'Kuiten (soleus)', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-20', defaultRir: '0-1', defaultRest: 60, instructions: 'Zittend, volledige range op de kuiten.', cues: 'Diepe stretch onderaan.', mistakes: 'Halve range.', alternatives: ['ex_standing_calf_raise'] },

    // ── Core exercises ───────────────────────────────────────────────────
    { id: 'ex_cable_crunch', name: 'Cable Crunch', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: [], equipment: 'Kabelmachine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Op de knieën, ronden vanuit de buikspieren naar beneden.', cues: 'Heupen stil houden, alleen de romp buigt.', mistakes: 'Met de armen trekken.', alternatives: ['ex_reverse_crunch'] },
    { id: 'ex_reverse_crunch', name: 'Reverse Crunch', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: [], equipment: 'Mat', location: 'beide', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Bekken optillen richting de ribben, benen gebogen.', cues: 'Traag en gecontroleerd.', mistakes: 'Momentum gebruiken.', alternatives: ['ex_cable_crunch'] },
    { id: 'ex_pallof_press', name: 'Pallof Press', category: 'Core', primaryMuscle: 'Buikspieren (anti-rotatie)', secondaryMuscles: ['Schouders', 'Core-stabiliteit'], equipment: 'Kabelmachine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '10-12 per kant', defaultRir: '1-2', defaultRest: 60, instructions: 'Kabel opzij van het lichaam, handvat recht voor de borst wegduwen zonder dat de romp meedraait.', cues: 'Buikspieren aangespannen, rustige ademhaling.', mistakes: 'Romp laten meedraaien met de duw.', alternatives: [] },
    { id: 'ex_ab_wheel', name: 'Ab Wheel', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: ['Lage rug'], equipment: 'Ab wheel', location: 'gym', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Vanuit de knieën uitrollen zonder de rug door te laten zakken.', cues: 'Bekken gekanteld houden.', mistakes: 'Te ver uitrollen met verlies van core-spanning.', alternatives: ['ex_plank'] },
    { id: 'ex_plank', name: 'Plank', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: ['Lage rug'], equipment: 'Mat', location: 'beide', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '30-60 sec', defaultRir: '1-2', defaultRest: 60, instructions: 'Rechte lijn van hoofd tot hielen.', cues: 'Billen licht aanspannen.', mistakes: 'Heupen laten zakken.', alternatives: ['ex_ab_wheel'] },

    // ── Kettlebell movements ──────────────────────────────────────────────
    { id: 'kb_halo', name: 'Kettlebell Halo', category: 'Mobiliteit/Schouders', primaryMuscle: 'Schouders', secondaryMuscles: ['Core'], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '8 per richting', defaultRest: 0, instructions: 'Kettlebell rond het hoofd bewegen, dicht bij de schedel.', cues: 'Romp stabiel, rustig tempo.', mistakes: 'Te ruime cirkel.', alternatives: [] },
    { id: 'kb_snatch', name: 'Kettlebell Snatch', category: 'Ballistisch', primaryMuscle: 'Schouders', secondaryMuscles: ['Hamstrings', 'Bilspieren', 'Core'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: 'max per arm', defaultRest: 0, instructions: 'Kettlebell één beweging van de grond tot recht boven het hoofd. Vanuit de heupextensie de kettlebell omhoog leiden tot lockout.', cues: 'Heup drijft de beweging. Punch through bovenaan voor soepele ontvangst.', mistakes: 'Te veel arm, kettlebell sloopt de pols bovenaan.', alternatives: ['kb_clean_press'] },
    { id: 'kb_renegade_row', name: 'Renegade Row', category: 'Core/Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Core', 'Schouders'], equipment: 'Kettlebell(s)', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: 'max per arm', defaultRest: 0, instructions: 'Plankpositie met handen op de kettlebells, om beurten één kettlebell optrekken naar de heup zonder dat de heupen kantelen.', cues: 'Voeten iets breder voor extra stabiliteit.', mistakes: 'Heupen laten meedraaien bij het optrekken.', alternatives: [] },
    { id: 'kb_windmill', name: 'Kettlebell Windmill', category: 'Mobiliteit/Core', primaryMuscle: 'Core (lateraal)', secondaryMuscles: ['Schouders', 'Hamstrings'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: 'max per kant', defaultRest: 0, instructions: 'Kettlebell boven het hoofd, voeten 45° uitgedraaid. Aanwijzen met de lagere hand langs het been zakken terwijl de KB arm gestrekt blijft.', cues: 'Ogen op de kettlebell houden. Heupen naar de zijkant duwen.', mistakes: 'Arm buigen, te ver zakken met gebogen rug.', alternatives: [] },
    { id: 'kb_goblet_squat', name: 'Goblet Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren', 'Core'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '12', defaultRest: 0, instructions: 'Kettlebell voor de borst, diep zakken tussen de knieën.', cues: 'Ellebogen tussen de knieën onderaan.', mistakes: 'Hielen optillen.', alternatives: [] },
    { id: 'kb_russian_swing', name: 'KB Russian Swing (Hardstyle)', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Bilspieren', 'Core'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '15', defaultRest: 0, instructions: 'Explosieve heupextensie drijft de kettlebell tot schouderhoogte. Hardstyle: actieve core-aanspanning en glute squeeze in de topstand.', cues: 'Heupen zijn de motor, armen zijn het touw. Bovenkant van de swing = plank.', mistakes: 'Squat maken i.p.v. hip hinge, rug ronden.', alternatives: ['kb_rdl'] },
    { id: 'kb_sl_rdl', name: 'Eenbeen Deadlift (KB)', category: 'Unilateraal', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Bilspieren', 'Balans'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8 per been', defaultRest: 0, instructions: 'Op één been buigen, kettlebell naar de grond.', cues: 'Heupen recht houden, staanbeen licht gebogen.', mistakes: 'Rotatie in de heupen.', alternatives: [] },
    { id: 'kb_calf_raise', name: 'Kuitverheffing (KB)', category: 'Isolatie', primaryMuscle: 'Kuiten', secondaryMuscles: [], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '15', defaultRest: 0, instructions: 'Kettlebell vasthouden, op de tenen komen met volledige range.', cues: 'Even pauzeren bovenaan.', mistakes: 'Te snel tempo, halve range.', alternatives: [] },
    { id: 'kb_rdl', name: 'Kettlebell Romanian Deadlift', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Bilspieren'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '12', defaultRest: 0, instructions: 'Heupen naar achteren, kettlebell dicht bij de benen.', cues: 'Rug neutraal.', mistakes: 'Rug ronden.', alternatives: [] },
    { id: 'kb_clean_press', name: 'Clean and Strict Press', category: 'Push', primaryMuscle: 'Schouders', secondaryMuscles: ['Bovenrug', 'Core'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '6 per arm', defaultRest: 0, instructions: 'Kettlebell optrekken naar rackpositie, dan drukken.', cues: 'Heupen aandrijven bij de clean.', mistakes: 'Kettlebell tegen de onderarm laten smakken.', alternatives: ['kb_snatch'] },
    { id: 'kb_floor_press', name: 'Single-arm Floor Press', category: 'Push', primaryMuscle: 'Borst', secondaryMuscles: ['Triceps'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8-10 per arm', defaultRest: 0, instructions: 'Liggend op de grond, kettlebell vanaf de borst rustig naar boven drukken.', cues: 'Elleboog raakt de grond voor je weer drukt.', mistakes: 'Onderrug hol trekken.', alternatives: [] },
    { id: 'kb_row', name: 'One-arm Kettlebell Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8-10 per arm', defaultRest: 0, instructions: 'Voorover gebogen, kettlebell naar de heup trekken.', cues: 'Rug neutraal houden.', mistakes: 'Rotatie in de romp.', alternatives: [] },

    // Cardio
    { id: 'ex_cardio_session', name: 'Cardiosessie', category: 'Cardio', primaryMuscle: 'Cardiovasculair', secondaryMuscles: [], equipment: 'Variabel', location: 'beide', type: 'cardio', weightUnit: 'bodyweight', defaultReps: '45-75 min', defaultRest: 0, instructions: 'Fietsen, zwemmen, rustig lopen, wandelen met helling of vrije cardio, hoofdzakelijk zone 2.', cues: 'Niet volledig uitputtend.', mistakes: 'Te hoge intensiteit die krachtherstel hindert.', alternatives: [] },
  ];

  exercises.forEach(e => { e.status = e.status || 'actief'; });

  // ---- Gym workout templates (PPL) --------------------------------------
  // method: 'intensity' | 'volume' — for UI colour coding
  const gymTemplates = [
    {
      id: 'gym_push', type: 'gym', day: 'push', name: 'Push — Borst · Schouders · Triceps',
      focus: ['Borst', 'Schouders', 'Triceps', 'Intensiteits- + volumemethode'],
      exercises: [
        // Intensity compound
        { exerciseId: 'ex_incline_bb_bench', sets: 3, repsMin: 6, repsMax: 8, rir: '1-2', restSec: 150, essential: true, method: 'intensity' },
        // Volume compound
        { exerciseId: 'ex_flat_db_bench', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true, method: 'volume' },
        // Shoulder intensity
        { exerciseId: 'ex_ohp', sets: 3, repsMin: 5, repsMax: 8, rir: '1-2', restSec: 150, essential: true, method: 'intensity' },
        // Lateral delts volume
        { exerciseId: 'ex_lateral_raise', sets: 3, repsMin: 12, repsMax: 20, rir: '0-2', restSec: 60, essential: true, method: 'volume' },
        // Triceps
        { exerciseId: 'ex_triceps_pushdown', sets: 3, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_ov_triceps_ext', sets: 3, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
      ]
    },
    {
      id: 'gym_pull', type: 'gym', day: 'pull', name: 'Pull — Rug · Biceps · Achterste schouders',
      focus: ['Lats', 'Bovenrug', 'Biceps', 'Achterste schouders'],
      exercises: [
        // Vertical pull intensity
        { exerciseId: 'ex_lat_pulldown', sets: 3, repsMin: 6, repsMax: 8, rir: '1-2', restSec: 120, essential: true, method: 'intensity' },
        // Horizontal pull intensity
        { exerciseId: 'ex_chest_supported_row', sets: 3, repsMin: 6, repsMax: 10, rir: '1-2', restSec: 120, essential: true, method: 'intensity' },
        // Vertical pull volume
        { exerciseId: 'ex_assisted_pullup', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true, method: 'volume' },
        // Horizontal pull volume
        { exerciseId: 'ex_oneam_db_row', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true, method: 'volume' },
        // Rear delt
        { exerciseId: 'ex_face_pull', sets: 2, repsMin: 12, repsMax: 20, rir: '0-2', restSec: 60, essential: false, method: 'volume' },
        // Biceps
        { exerciseId: 'ex_incline_db_curl', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_cable_curl', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
      ]
    },
    {
      id: 'gym_legs', type: 'gym', day: 'legs', name: 'Legs — Quads · Hamstrings · Glutes · Kuiten',
      focus: ['Quadriceps', 'Hamstrings', 'Bilspieren', 'Kuiten'],
      exercises: [
        // Quad intensity
        { exerciseId: 'ex_back_squat', sets: 3, repsMin: 5, repsMax: 8, rir: '1-2', restSec: 165, essential: true, method: 'intensity' },
        // Hamstring volume
        { exerciseId: 'ex_rdl', sets: 3, repsMin: 6, repsMax: 10, rir: '1-2', restSec: 150, essential: true, method: 'volume' },
        // Quad volume (unilateral)
        { exerciseId: 'ex_bulgarian_split_squat', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true, method: 'volume' },
        // Hamstring isolation
        { exerciseId: 'ex_leg_curl', sets: 3, repsMin: 10, repsMax: 15, rir: '0-2', restSec: 75, essential: true, method: 'volume' },
        // Quad isolation
        { exerciseId: 'ex_leg_extension', sets: 2, repsMin: 12, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
        // Calves
        { exerciseId: 'ex_standing_calf_raise', sets: 3, repsMin: 10, repsMax: 20, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_seated_calf_raise', sets: 3, repsMin: 12, repsMax: 20, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
      ]
    },
  ];

  // ---- Kettlebell templates (standalone KB days) ------------------------
  // These are NOT alternatives to gym days — they ARE the day.
  const kettlebellTemplates = [
    {
      id: 'kb_upper_std', type: 'kettlebell', day: 'kbUpper', variant: 'standard',
      name: 'KB Upper — Kracht & Stabiliteit',
      durationMin: 30,
      items: [
        // Warmup
        { exerciseId: 'kb_halo', reps: '8 per richting', note: 'Warming-up' },
        // Ballistic power
        { exerciseId: 'kb_snatch', reps: 'Max per arm', sets: 3, note: 'Explosief' },
        // Anti-rotation pull
        { exerciseId: 'kb_renegade_row', reps: 'Max per arm', sets: 3, note: 'Core strak' },
        // Lateral chain / overhead stability
        { exerciseId: 'kb_windmill', reps: 'Max per kant', sets: 3, note: 'Traag en gecontroleerd' },
      ]
    },
    {
      id: 'kb_lower_std', type: 'kettlebell', day: 'kbLower', variant: 'standard',
      name: 'KB Lower — Hip Power & Balans',
      durationMin: 30,
      items: [
        // Warmup via goblet squat warmup protocol (light)
        { exerciseId: 'kb_goblet_squat', reps: '12', sets: 3, note: 'Warming-up met lichtere KB' },
        // Hip hinge power
        { exerciseId: 'kb_russian_swing', reps: '15', sets: 4, note: 'Hardstyle — explosief' },
        // Unilateral balance
        { exerciseId: 'kb_sl_rdl', reps: '8 per been', sets: 3, note: 'Gecontroleerd' },
        // Calves
        { exerciseId: 'kb_calf_raise', reps: '15', sets: 3, note: 'Volledige range' },
      ]
    },
  ];

  const cardioTemplate = {
    id: 'cardio_default', type: 'cardio', day: 'cardio', name: 'Cardio',
    durationMin: [45, 75], zone: 'Zone 2'
  };

  // ---- Default weekly schedule -------------------------------------------
  // Ma Push · Di Pull · Wo Legs · Do Rust · Vr KB Upper · Za KB Lower · Zo Rust
  const defaultSchedule = {
    key: 'app',
    firstDayOfWeek: 'mon',
    days: {
      mon: 'push',
      tue: 'pull',
      wed: 'legs',
      thu: 'rest',
      fri: 'kbUpper',
      sat: 'kbLower',
      sun: 'rest',
    }
  };

  const defaultSettings = {
    key: 'app',
    name: 'Simon',
    heightCm: 189,
    startWeightKg: 82,
    goalWeightKg: null,
    weightUnit: 'kg',
    distanceUnit: 'km',
    firstDayOfWeek: 'mon',
    defaultGymDurationMin: 60,
    defaultKettlebellWeight: 12,
    dumbbellSteps: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    plateSteps: [1.25, 2.5, 5, 10, 15, 20],
    machineStep: 5,
    kettlebells: [12, 16, 20, 24],
    cardioFavorite: 'fietsen',
    darkMode: true,
    goal: 'spiermassa',
    photosHiddenByDefault: false,
    onboardingDone: false,
  };

  return { exercises, gymTemplates, kettlebellTemplates, cardioTemplate, defaultSchedule, defaultSettings };
})();
