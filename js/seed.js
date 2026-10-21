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
    { id: 'ex_incline_bb_bench', name: 'Incline Barbell Bench Press', category: 'Push', primaryMuscle: 'Chest (upper)', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: 'Barbell, bench', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '6-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Set bench to 30-45°. Press bar from chest upward, full lockout.', cues: 'Shoulder blades together and down, feet firmly planted.', mistakes: 'Bench angle too steep, bouncing off the chest.', alternatives: ['ex_incline_db_bench'] },
    { id: 'ex_incline_db_bench', name: 'Incline Dumbbell Bench Press', category: 'Push', primaryMuscle: 'Chest (upper)', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: 'Dumbbells, bench', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '6-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Set bench to 30-45°. Press dumbbells from chest level upward.', cues: 'Wrist directly above elbow, controlled descent.', mistakes: 'Letting the weights clank at the top.', alternatives: ['ex_incline_bb_bench'] },
    { id: 'ex_flat_db_bench', name: 'Flat Dumbbell Bench Press', category: 'Push', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: 'Dumbbells, bench', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Flat bench, press dumbbells from chest height upward.', cues: "Slight arch, don't fully lock elbows.", mistakes: 'Lowering the weight too quickly.', alternatives: ['ex_chest_press_machine'] },
    { id: 'ex_chest_press_machine', name: 'Machine Chest Press', category: 'Push', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: 'Machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Press handles straight forward.', cues: 'Shoulder blades pressed into the back pad.', mistakes: 'Letting the handles drift outward.', alternatives: ['ex_flat_db_bench'] },
    { id: 'ex_ohp', name: 'Standing Barbell Overhead Press', category: 'Push', primaryMuscle: 'Shoulders', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Barbell', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '5-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Press the bar straight up from shoulder level.', cues: 'Squeeze glutes, move head slightly through as bar passes.', mistakes: 'Excessive arch in the lower back.', alternatives: ['ex_db_shoulder_press'] },
    { id: 'ex_db_shoulder_press', name: 'Dumbbell Shoulder Press', category: 'Push', primaryMuscle: 'Shoulders', secondaryMuscles: ['Triceps'], equipment: 'Dumbbells', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 120, instructions: 'Seated or standing, press dumbbells straight up.', cues: 'Keep elbows slightly in front of the body.', mistakes: 'Going too heavy, shrugging the shoulders.', alternatives: ['ex_ohp'] },
    { id: 'ex_lateral_raise', name: 'Lateral Raise', category: 'Isolation', primaryMuscle: 'Lateral delts', secondaryMuscles: [], equipment: 'Dumbbells or cable', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Raise arms sideways to shoulder height.', cues: 'Slight bend in the elbow, lead with the elbows.', mistakes: 'Using hip momentum.', alternatives: [] },
    { id: 'ex_triceps_pushdown', name: 'Triceps Pushdown', category: 'Isolation', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Cable machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Keep elbows at sides, push forearms down.', cues: 'Full extension at the bottom.', mistakes: 'Letting elbows flare out.', alternatives: ['ex_ov_triceps_ext'] },
    { id: 'ex_ov_triceps_ext', name: 'Overhead Triceps Extension', category: 'Isolation', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Dumbbell or cable', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Extend weight behind the head.', cues: 'Keep elbows close to the head.', mistakes: 'Letting elbows flare out.', alternatives: ['ex_triceps_pushdown'] },

    // ── PULL exercises ───────────────────────────────────────────────────
    { id: 'ex_lat_pulldown', name: 'Lat Pulldown', category: 'Pull', primaryMuscle: 'Back (lats)', secondaryMuscles: ['Biceps'], equipment: 'Cable machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Pull bar to upper chest, elbows down and back.', cues: 'Chest up, no momentum from the back.', mistakes: 'Leaning too far back.', alternatives: ['ex_assisted_pullup'] },
    { id: 'ex_assisted_pullup', name: 'Assisted Pull-up', category: 'Pull', primaryMuscle: 'Back (lats)', secondaryMuscles: ['Biceps'], equipment: 'Assisted pull-up machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Full range of motion, chin above the bar.', cues: 'Actively pull shoulder blades down at the start.', mistakes: 'Half reps.', alternatives: ['ex_lat_pulldown'] },
    { id: 'ex_chest_supported_row', name: 'Chest Supported Dumbbell Row', category: 'Pull', primaryMuscle: 'Upper back', secondaryMuscles: ['Biceps', 'Rear delts'], equipment: 'Dumbbells, incline bench', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 120, instructions: 'Chest on incline bench, pull dumbbells toward hips.', cues: 'Squeeze shoulder blades at the top.', mistakes: 'Rounding the back.', alternatives: ['ex_seated_cable_row'] },
    { id: 'ex_oneam_db_row', name: 'One-arm Dumbbell Row', category: 'Pull', primaryMuscle: 'Upper back', secondaryMuscles: ['Biceps'], equipment: 'Dumbbell, bench', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Knee and hand on bench, pull dumbbell toward hip.', cues: 'Torso stable, no rotation.', mistakes: 'Using a jerking motion.', alternatives: ['ex_seated_cable_row'] },
    { id: 'ex_seated_cable_row', name: 'Seated Cable Row', category: 'Pull', primaryMuscle: 'Upper back', secondaryMuscles: ['Biceps'], equipment: 'Cable machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Pull handle to the abdomen, back upright.', cues: 'Squeeze shoulder blades at the end.', mistakes: 'Leaning back to pull.', alternatives: ['ex_oneam_db_row'] },
    { id: 'ex_rear_delt_fly', name: 'Rear Delt Fly', category: 'Isolation', primaryMuscle: 'Rear delts', secondaryMuscles: ['Upper back'], equipment: 'Dumbbells or machine', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Slightly bent forward, open arms sideways and back.', cues: 'Small range, focus on the rear deltoid.', mistakes: 'Too heavy, using momentum.', alternatives: ['ex_face_pull'] },
    { id: 'ex_face_pull', name: 'Face Pull', category: 'Isolation', primaryMuscle: 'Rear delts', secondaryMuscles: ['Upper back'], equipment: 'Cable machine, rope', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Pull rope toward face, elbows high.', cues: 'Hands end up beside the ears.', mistakes: 'Too heavy, short range.', alternatives: ['ex_rear_delt_fly'] },
    { id: 'ex_incline_db_curl', name: 'Incline Dumbbell Curl', category: 'Isolation', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'Dumbbells, incline bench', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'On incline bench, fully extend arms and curl.', cues: 'Keep elbows behind the torso.', mistakes: 'Shrugging the shoulders.', alternatives: ['ex_cable_curl'] },
    { id: 'ex_cable_curl', name: 'Cable Curl', category: 'Isolation', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'Cable machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Constant tension, full curl.', cues: 'Elbows at the sides.', mistakes: 'Shoulders moving along.', alternatives: ['ex_incline_db_curl'] },

    // ── LEGS exercises ───────────────────────────────────────────────────
    { id: 'ex_back_squat', name: 'Back Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Core'], equipment: 'Barbell, rack', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '5-8', defaultRir: '1-2', defaultRest: 165, instructions: 'Bar on upper back, squat down to at least parallel.', cues: 'Knees in line with toes, chest up.', mistakes: 'Knees caving inward.', alternatives: ['ex_hack_squat'] },
    { id: 'ex_hack_squat', name: 'Hack Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 120, instructions: 'Back against the pad, squat deep and press.', cues: 'Full foot flat on the platform.', mistakes: 'Lifting the heels.', alternatives: ['ex_back_squat'] },
    { id: 'ex_rdl', name: 'Romanian Deadlift', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Lower back'], equipment: 'Barbell', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 150, instructions: 'Hips back, bar close to the legs, neutral back.', cues: 'Slight knee bend, feel the stretch in the hamstrings.', mistakes: 'Rounding the back.', alternatives: [] },
    { id: 'ex_bulgarian_split_squat', name: 'Bulgarian Split Squat', category: 'Unilateral', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes'], equipment: 'Dumbbells, bench', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12 per leg', defaultRir: '1-2', defaultRest: 105, instructions: 'Rear foot elevated, lower straight down.', cues: 'Torso upright, weight on the front heel.', mistakes: 'Leaning too far forward.', alternatives: [] },
    { id: 'ex_leg_curl', name: 'Leg Curl', category: 'Isolation', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-2', defaultRest: 75, instructions: 'Curl heels toward glutes.', cues: 'Lower back under control.', mistakes: 'Lifting the hips.', alternatives: ['ex_seated_leg_curl'] },
    { id: 'ex_seated_leg_curl', name: 'Seated Leg Curl', category: 'Isolation', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-2', defaultRest: 75, instructions: 'Seated, curl heels downward.', cues: 'Full range of motion.', mistakes: 'Lifting the hips.', alternatives: ['ex_leg_curl'] },
    { id: 'ex_leg_extension', name: 'Leg Extension', category: 'Isolation', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Extend lower legs to near full extension.', cues: 'Brief pause at the top.', mistakes: 'Letting weight drop back too quickly.', alternatives: [] },
    { id: 'ex_standing_calf_raise', name: 'Standing Calf Raise', category: 'Isolation', primaryMuscle: 'Calves', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-20', defaultRir: '0-1', defaultRest: 60, instructions: 'Full range: deep stretch to full height on toes.', cues: 'Brief pause at the top.', mistakes: 'Half range of motion.', alternatives: ['ex_seated_calf_raise'] },
    { id: 'ex_seated_calf_raise', name: 'Seated Calf Raise', category: 'Isolation', primaryMuscle: 'Calves (soleus)', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-20', defaultRir: '0-1', defaultRest: 60, instructions: 'Seated, full range of motion on calves.', cues: 'Deep stretch at the bottom.', mistakes: 'Half range of motion.', alternatives: ['ex_standing_calf_raise'] },

    // ── Core exercises ───────────────────────────────────────────────────
    { id: 'ex_cable_crunch', name: 'Cable Crunch', category: 'Core', primaryMuscle: 'Abs', secondaryMuscles: [], equipment: 'Cable machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'On knees, crunch down from the abs.', cues: 'Keep hips still, only the torso flexes.', mistakes: 'Pulling with the arms.', alternatives: ['ex_reverse_crunch'] },
    { id: 'ex_reverse_crunch', name: 'Reverse Crunch', category: 'Core', primaryMuscle: 'Abs', secondaryMuscles: [], equipment: 'Mat', location: 'both', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Lift pelvis toward ribs, legs bent.', cues: 'Slow and controlled.', mistakes: 'Using momentum.', alternatives: ['ex_cable_crunch'] },
    { id: 'ex_pallof_press', name: 'Pallof Press', category: 'Core', primaryMuscle: 'Abs (anti-rotation)', secondaryMuscles: ['Shoulders', 'Core stability'], equipment: 'Cable machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '10-12 per side', defaultRir: '1-2', defaultRest: 60, instructions: 'Cable to the side of the body, press handle straight in front of chest without letting the torso rotate.', cues: 'Core braced, steady breathing.', mistakes: 'Letting the torso rotate with the press.', alternatives: [] },
    { id: 'ex_ab_wheel', name: 'Ab Wheel', category: 'Core', primaryMuscle: 'Abs', secondaryMuscles: ['Lower back'], equipment: 'Ab wheel', location: 'gym', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Roll out from the knees without letting the back sag.', cues: 'Keep pelvis tilted.', mistakes: 'Rolling too far out with loss of core tension.', alternatives: ['ex_plank'] },
    { id: 'ex_plank', name: 'Plank', category: 'Core', primaryMuscle: 'Abs', secondaryMuscles: ['Lower back'], equipment: 'Mat', location: 'both', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '30-60 sec', defaultRir: '1-2', defaultRest: 60, instructions: 'Straight line from head to heels.', cues: 'Slightly squeeze the glutes.', mistakes: 'Letting the hips sag.', alternatives: ['ex_ab_wheel'] },

    // ── Kettlebell movements ──────────────────────────────────────────────
    { id: 'kb_halo', name: 'Kettlebell Halo', category: 'Mobility/Shoulders', primaryMuscle: 'Shoulders', secondaryMuscles: ['Core'], equipment: 'Kettlebell', location: 'home', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '8 per side', defaultRest: 0, instructions: 'Move kettlebell around the head, close to the skull.', cues: 'Torso stable, steady pace.', mistakes: 'Circle too wide.', alternatives: [] },
    { id: 'kb_snatch', name: 'Kettlebell Snatch', category: 'Ballistic', primaryMuscle: 'Shoulders', secondaryMuscles: ['Hamstrings', 'Glutes', 'Core'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: 'max per arm', defaultRest: 0, instructions: 'Kettlebell in one movement from swing to lockout overhead. Drive from hip extension to guide the bell to lockout.', cues: 'Hip drives the movement. Punch through at the top for a smooth catch.', mistakes: 'Too much arm, bell crashes into the wrist at the top.', alternatives: ['kb_clean_press'] },
    { id: 'kb_renegade_row', name: 'Renegade Row', category: 'Core/Pull', primaryMuscle: 'Upper back', secondaryMuscles: ['Core', 'Shoulders'], equipment: 'Kettlebell(s)', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: 'max per arm', defaultRest: 0, instructions: 'Plank position with hands on kettlebells, alternately row one kettlebell to the hip without the hips rotating.', cues: 'Feet slightly wider for extra stability.', mistakes: 'Letting the hips rotate when rowing.', alternatives: [] },
    { id: 'kb_windmill', name: 'Kettlebell Windmill', category: 'Mobility/Core', primaryMuscle: 'Core (lateral)', secondaryMuscles: ['Shoulders', 'Hamstrings'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: 'max per side', defaultRest: 0, instructions: 'Kettlebell overhead, feet turned out 45°. Point with the lower hand as you lower along the leg while keeping the KB arm extended.', cues: 'Eyes on the kettlebell. Push hips to the side.', mistakes: 'Bending the arm, lowering too far with a rounded back.', alternatives: [] },
    { id: 'kb_goblet_squat', name: 'Goblet Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Core'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: '12', defaultRest: 0, instructions: 'Kettlebell in front of chest, squat deep between the knees.', cues: 'Elbows between the knees at the bottom.', mistakes: 'Lifting the heels.', alternatives: [] },
    { id: 'kb_russian_swing', name: 'KB Russian Swing (Hardstyle)', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Core'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: '15', defaultRest: 0, instructions: 'Explosive hip extension drives the kettlebell to shoulder height. Hardstyle: active core bracing and glute squeeze at the top.', cues: 'Hips are the engine, arms are the rope. Top of the swing = plank position.', mistakes: 'Squatting instead of hip hinge, rounding the back.', alternatives: ['kb_rdl'] },
    { id: 'kb_sl_rdl', name: 'Single-leg Deadlift (KB)', category: 'Unilateral', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Balance'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8 per leg', defaultRest: 0, instructions: 'Balance on one leg, hinge with kettlebell toward the ground.', cues: 'Keep hips square, slight bend in the standing leg.', mistakes: 'Rotation in the hips.', alternatives: [] },
    { id: 'kb_calf_raise', name: 'Calf Raise (KB)', category: 'Isolation', primaryMuscle: 'Calves', secondaryMuscles: [], equipment: 'Kettlebell', location: 'home', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '15', defaultRest: 0, instructions: 'Hold kettlebell, rise onto toes with full range of motion.', cues: 'Brief pause at the top.', mistakes: 'Too fast, half range of motion.', alternatives: [] },
    { id: 'kb_rdl', name: 'Kettlebell Romanian Deadlift', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: '12', defaultRest: 0, instructions: 'Hips back, kettlebell close to the legs.', cues: 'Neutral back.', mistakes: 'Rounding the back.', alternatives: [] },
    { id: 'kb_clean_press', name: 'Clean and Strict Press', category: 'Push', primaryMuscle: 'Shoulders', secondaryMuscles: ['Upper back', 'Core'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: '6 per arm', defaultRest: 0, instructions: 'Clean kettlebell to rack position, then press.', cues: 'Drive with the hips on the clean.', mistakes: 'Bell crashing into the forearm.', alternatives: ['kb_snatch'] },
    { id: 'kb_floor_press', name: 'Single-arm Floor Press', category: 'Push', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8-10 per arm', defaultRest: 0, instructions: 'Lying on the floor, press kettlebell from chest upward in a controlled manner.', cues: 'Elbow touches the floor before pressing again.', mistakes: 'Arching the lower back.', alternatives: [] },
    { id: 'kb_row', name: 'One-arm Kettlebell Row', category: 'Pull', primaryMuscle: 'Upper back', secondaryMuscles: ['Biceps'], equipment: 'Kettlebell', location: 'home', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8-10 per arm', defaultRest: 0, instructions: 'Bent over, pull kettlebell toward hip.', cues: 'Keep back neutral.', mistakes: 'Rotation in the torso.', alternatives: [] },

    // ── Extra LEGS exercises ──────────────────────────────────────────────
    { id: 'ex_warmup_legs_80', name: '2 Build-up Sets — Hack Squat / Leg Press', category: 'Warm-up', primaryMuscle: 'Mobility', secondaryMuscles: ['Quadriceps', 'Knees'], equipment: 'Machine', location: 'gym', type: 'warmup', weightUnit: 'bodyweight', defaultReps: '5 min', defaultRest: 0, instructions: '2 build-up sets on hack squat or leg press at 50–60% of your working weight. Focus on full range of motion and joint prep.', cues: 'Light weight, controlled descent. Open up the knees and hips before loading.', mistakes: 'Skipping warm-up sets on heavy quad compounds — increases injury risk.', alternatives: [] },
    { id: 'ex_warmup_legs', name: 'Leg Swings + Empty Bar Squat', category: 'Warm-up', primaryMuscle: 'Mobility', secondaryMuscles: ['Quadriceps', 'Hips'], equipment: 'Empty barbell', location: 'gym', type: 'warmup', weightUnit: 'bodyweight', defaultReps: '5 min', defaultRest: 0, instructions: '10 leg swings front/back + 10 sideways per leg. Then 2×10 empty bar squat — focus on depth, knees follow feet, chest up.', cues: 'Easy pace. Feel the movement, open up the hips.', mistakes: 'Starting too fast, squat not deep enough.', alternatives: [] },
    { id: 'ex_leg_press', name: 'Leg Press', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes'], equipment: 'Machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '2-3', defaultRest: 120, instructions: 'Feet shoulder-width, in the middle of the platform. Lower under control to 90°.', cues: 'Keep back flat against the pad. Push feet actively into the platform.', mistakes: 'Knees caving inward. Lifting the heels.', alternatives: ['ex_back_squat', 'ex_hack_squat'] },
    { id: 'ex_nordic_curl', name: 'Nordic Hamstring Curl', category: 'Hinge', primaryMuscle: 'Hamstrings (eccentric)', secondaryMuscles: ['Calves', 'Glutes'], equipment: 'Bench or partner', location: 'gym', type: 'compound', weightUnit: 'bodyweight', defaultReps: '5-8', defaultRir: null, defaultRest: 120, instructions: 'Ankles fixed. Lower body forward slowly — brake with the hamstrings as long as possible. Catch with hands, push back.', cues: 'Body straight, glutes squeezed. Brake as long as possible.', mistakes: 'Falling too fast. Bending at the hips.', alternatives: ['ex_leg_curl', 'ex_seated_leg_curl'] },
    { id: 'ex_hip_thrust', name: 'Hip Thrust', category: 'Hinge', primaryMuscle: 'Gluteus Maximus', secondaryMuscles: ['Hamstrings', 'Core'], equipment: 'Barbell, bench', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '10-15', defaultRir: '2-3', defaultRest: 90, instructions: 'Shoulder blades on bench, bar over hips (foam roller). Full extension at the top, squeeze glutes for 1 sec.', cues: "Drive hips upward, don't hyperextend the back. Look straight ahead.", mistakes: 'Hyperextending the lower back at the top. No full extension.', alternatives: ['ex_rdl'] },
    { id: 'ex_sl_calf_raise', name: 'Single-leg Calf Raise', category: 'Isolation', primaryMuscle: 'Calves (unilateral)', secondaryMuscles: ['Gastrocnemius'], equipment: 'Step', location: 'gym', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '10-15 per leg', defaultRir: null, defaultRest: 60, instructions: 'On an elevated surface (step). Other foot behind the ankle. Full descent — maximum stretch at the bottom. Slow raise.', cues: "Brief pause at the top. Full range — don't stop halfway.", mistakes: 'Stopping halfway. No full stretch at the bottom.', alternatives: ['ex_standing_calf_raise'] },

    // ── Core / Abs exercises ──────────────────────────────────────────────
    { id: 'ex_hanging_knee_raise', name: 'Hanging Knee Raise', category: 'Core', primaryMuscle: 'Abs', secondaryMuscles: ['Hip flexors'], equipment: 'Pull-up bar', location: 'gym', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Hang from a pull-up bar. Raise knees toward chest, curling the pelvis upward at the top.', cues: 'Avoid swinging. Control the descent slowly.', mistakes: 'Using momentum, cutting range short, not curling the pelvis.', alternatives: ['ex_reverse_crunch', 'ex_cable_crunch'] },

    // ── TRX exercises ─────────────────────────────────────────────────────
    { id: 'ex_warmup_trx', name: 'TRX Warm-up', category: 'Warm-up', primaryMuscle: 'Full body', secondaryMuscles: [], equipment: 'TRX', location: 'home', type: 'warmup', weightUnit: 'bodyweight', defaultReps: '5 min', defaultRest: 0, instructions: '5 minutes of light movement — arm circles, hip rotations, leg swings, and light TRX rows to warm up the joints and activate the muscles.', cues: 'Easy pace. Feel the movement.', mistakes: 'Skipping the warm-up.', alternatives: [] },
    { id: 'ex_cooldown_trx', name: 'TRX Cooldown', category: 'Warm-up', primaryMuscle: 'Full body', secondaryMuscles: [], equipment: 'TRX', location: 'home', type: 'warmup', weightUnit: 'bodyweight', defaultReps: '5 min', defaultRest: 0, instructions: '5 minutes of static stretching — hip flexors, hamstrings, calves, quads. Hold each stretch 30–45 seconds.', cues: 'Breathe deeply, relax into each stretch.', mistakes: 'Bouncing in the stretch.', alternatives: [] },
    { id: 'ex_trx_low_row', name: 'TRX Low Row', category: 'Pull', primaryMuscle: 'Upper back', secondaryMuscles: ['Biceps', 'Rear delts'], equipment: 'TRX', location: 'home', type: 'compound', weightUnit: 'bodyweight', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 60, instructions: 'Hold TRX handles at waist height with arms extended, body leaning back. Pull chest to hands, elbows driving backward.', cues: 'Shoulder blades squeeze at the top. Body straight throughout.', mistakes: 'Bending at the hips, shrugging the shoulders.', alternatives: [] },
    { id: 'ex_trx_chest_press', name: 'TRX Chest Press', category: 'Push', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: 'TRX', location: 'home', type: 'compound', weightUnit: 'bodyweight', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 60, instructions: 'Face away from anchor. Hold handles at chest height, body leaning forward. Lower chest toward hands, then press back.', cues: 'Body stays in a plank line. Elbows at roughly 45° from the body.', mistakes: 'Hips dropping, flaring elbows too wide.', alternatives: [] },
    { id: 'ex_trx_face_pull', name: 'TRX Face Pull', category: 'Isolation', primaryMuscle: 'Rear delts', secondaryMuscles: ['Upper back'], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8-10', defaultRir: '1-2', defaultRest: 60, instructions: 'Hold handles and lean back. Pull hands toward face with elbows flaring high and out to the sides.', cues: 'Elbows above shoulder height at the top.', mistakes: 'Elbows dropping too low, using hip momentum.', alternatives: [] },
    { id: 'ex_trx_flys', name: 'TRX Flys', category: 'Isolation', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders'], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 60, instructions: 'Face away from anchor, arms extended forward at chest height. Open arms wide to the sides, then bring them back together.', cues: 'Slight bend in elbows. Lead with the chest, not the arms.', mistakes: 'Fully locking the elbows, using momentum.', alternatives: [] },
    { id: 'ex_trx_y_raise', name: 'TRX Y-Raise', category: 'Isolation', primaryMuscle: 'Lateral delts', secondaryMuscles: ['Rear delts', 'Upper back'], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8-10', defaultRir: '1-2', defaultRest: 60, instructions: 'Lean back holding TRX handles. Raise both arms overhead and out into a Y-shape while maintaining body tension.', cues: 'Arms fully extended at the top. Squeeze the shoulder blades together.', mistakes: 'Bending the elbows, leaning too far back making it too easy.', alternatives: [] },
    { id: 'ex_trx_triceps_ext', name: 'TRX Triceps Extension', category: 'Isolation', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8', defaultRir: '1-2', defaultRest: 60, instructions: 'Face away from anchor, handles at forehead height. Lower forehead toward hands by bending elbows, keeping upper arms fixed. Extend back out.', cues: 'Upper arms stay close to the head. Body in a straight plank line.', mistakes: 'Letting the elbows flare, hips sagging.', alternatives: [] },
    { id: 'ex_trx_bicep_curl', name: 'TRX Bicep Hammer Curl', category: 'Isolation', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8', defaultRir: '1-2', defaultRest: 60, instructions: 'Face the anchor, palms facing each other. Lean back with arms extended, then curl hands toward temples.', cues: 'Elbows stay high and fixed. Body in a straight line.', mistakes: 'Letting elbows drop during the curl.', alternatives: [] },
    { id: 'ex_trx_abs_crunch', name: 'TRX Abs Crunch', category: 'Core', primaryMuscle: 'Abs', secondaryMuscles: ['Hip flexors'], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 60, instructions: 'Face away from anchor, feet in TRX straps in plank position. Draw knees toward chest, rounding the lower back slightly at the top.', cues: 'Control the return — resist the stretch slowly.', mistakes: 'Hips dropping in the plank position.', alternatives: [] },
    { id: 'ex_trx_front_back_squeeze', name: 'TRX Front & Back Squeeze', category: 'Core', primaryMuscle: 'Core', secondaryMuscles: ['Chest', 'Back'], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8', defaultRir: null, defaultRest: 15, instructions: 'Hold TRX handles, arm extended forward or backward. Isometrically squeeze — pull the strap or push against it — holding 8 seconds per side.', cues: 'Breathe steadily. Maximum tension throughout.', mistakes: 'Holding breath, releasing tension early.', alternatives: [] },

    // TRX Lower Body
    { id: 'ex_trx_squat_calf_raise', name: 'TRX Squat-to-Calf-Raise', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Calves', 'Glutes'], equipment: 'TRX', location: 'home', type: 'compound', weightUnit: 'bodyweight', defaultReps: '8-10', defaultRir: '1-2', defaultRest: 60, instructions: 'Hold TRX handles for balance. Squat down with a 2-second pause at the bottom, then rise and continue onto toes in a calf raise at the top.', cues: 'Knees track the toes. Full range on both the squat and the calf raise.', mistakes: 'Skipping the pause at the bottom, half-range calf raise.', alternatives: [] },
    { id: 'ex_trx_hip_thrust', name: 'TRX Hip Thrust', category: 'Hinge', primaryMuscle: 'Gluteus Maximus', secondaryMuscles: ['Hamstrings'], equipment: 'TRX', location: 'home', type: 'compound', weightUnit: 'bodyweight', defaultReps: '6', defaultRir: '1-2', defaultRest: 60, instructions: 'Feet in TRX straps, back on the floor. Drive hips upward by squeezing the glutes, creating a straight line from knees to shoulders.', cues: 'Squeeze glutes hard at the top for 1 sec. Do not hyperextend the back.', mistakes: 'Arching the lower back instead of driving through the glutes.', alternatives: [] },
    { id: 'ex_trx_reverse_lunge', name: 'TRX Reverse Lunge', category: 'Unilateral', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Balance'], equipment: 'TRX', location: 'home', type: 'compound', weightUnit: 'bodyweight', defaultReps: '10', defaultRir: '1-2', defaultRest: 60, instructions: 'Hold TRX for balance. Step one foot back and lower the rear knee toward the floor. Drive back up through the front heel. Complete all reps on one leg, then switch.', cues: 'Torso upright, front knee over the foot.', mistakes: 'Letting the front knee cave inward, leaning too far forward.', alternatives: [] },
    { id: 'ex_trx_hamstring_curl', name: 'TRX Hamstring Curl', category: 'Isolation', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes'], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8', defaultRir: '1-2', defaultRest: 60, instructions: 'Lie on your back, heels in TRX straps, hips lifted. Curl heels toward glutes while keeping hips high.', cues: 'Squeeze glutes throughout. Full extension on the return.', mistakes: 'Letting hips drop, using momentum.', alternatives: [] },
    { id: 'ex_trx_squat_25', name: 'TRX Squat (25 reps)', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes'], equipment: 'TRX', location: 'home', type: 'compound', weightUnit: 'bodyweight', defaultReps: '25', defaultRir: '0', defaultRest: 60, instructions: 'Hold TRX for balance and do as many squats as possible. When you reach failure, pause and rest briefly, then continue until you reach 25 total reps.', cues: 'Full depth each rep. Take brief pauses as needed to reach 25 total.', mistakes: 'Cutting depth to push through — better to pause than to cheat.', alternatives: [] },
    { id: 'ex_trx_squeeze_quads', name: 'TRX Quad Squeeze', category: 'Isolation', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8', defaultRir: null, defaultRest: 15, instructions: 'Seated or standing, maximally contract the quadriceps and hold for 8 seconds. Brief rest, then repeat.', cues: 'Squeeze as hard as possible — maximum isometric tension.', mistakes: 'Releasing tension too early.', alternatives: [] },
    { id: 'ex_trx_squeeze_hams', name: 'TRX Hamstring & Glute Squeeze', category: 'Isolation', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes'], equipment: 'TRX', location: 'home', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8', defaultRir: null, defaultRest: 15, instructions: 'Lying or seated, maximally contract the hamstrings and glutes simultaneously and hold for 8 seconds. Brief rest, then repeat.', cues: 'Drive heels into the ground to activate hamstrings. Squeeze glutes hard.', mistakes: 'Only squeezing the glutes without engaging hamstrings.', alternatives: [] },

    // ── Full Body warm-up ─────────────────────────────────────────────────
    { id: 'ex_warmup_fullbody', name: 'Full Body Warm-up', category: 'Warm-up', primaryMuscle: 'Full body', secondaryMuscles: [], equipment: 'Empty barbell', location: 'gym', type: 'warmup', weightUnit: 'bodyweight', defaultReps: '5 min', defaultRest: 0, instructions: '10 arm circles per arm (forward + backward) · 10 leg swings per leg (front/back) · 10 hip circles per side · 2×5 empty bar squat — full depth, controlled. Opwarmen van alle gewrichten voor je aan de compound oefeningen begint.', cues: 'Langzaam en gecontroleerd. Voel hoe je gewrichten opendraaien.', mistakes: 'Overslaan of te snel doorstomen.', alternatives: [] },

    // ── Forearm exercises ─────────────────────────────────────────────────
    { id: 'ex_db_wrist_curl', name: 'Dumbbell Wrist Curl', category: 'Isolation', primaryMuscle: 'Forearms (flexors)', secondaryMuscles: [], equipment: 'Dumbbells, bench', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Forearms resting on a bench or thighs, palms up. Hold dumbbells and curl the wrists upward through full range of motion.', cues: 'Only the wrists move. Full stretch at the bottom.', mistakes: 'Moving the forearms, using too much weight.', alternatives: ['ex_db_wrist_ext'] },
    { id: 'ex_db_wrist_ext', name: 'Sideways Dumbbell Wrist Extension', category: 'Isolation', primaryMuscle: 'Forearms (extensors)', secondaryMuscles: [], equipment: 'Dumbbell, bench', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Forearm resting on a bench with the wrist hanging off the edge, palm facing inward (thumb up). Extend the wrist upward, then lower back down with control.', cues: 'Slow and controlled. Full range — feel the stretch at the bottom.', mistakes: 'Moving the elbow, going too fast.', alternatives: ['ex_db_wrist_curl'] },
    { id: 'ex_cable_curl_face_away', name: 'Single Arm Face Away Cable Curl', category: 'Isolation', primaryMuscle: 'Biceps', secondaryMuscles: ['Brachialis'], equipment: 'Cable machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Sta met je rug naar het cable station, kabel op schouderhoogte of iets hoger. Houd de handle vast met één arm naast je hoofd, elleboog gebogen. Curl de hand richting je oor, voel de rek in de bicep bij de startpositie.', cues: 'Elleboog blijft hoog en stil. Maximale rek onderaan — laat de arm volledig strekken voor elke rep.', mistakes: 'Elleboog naar voren laten zakken, te weinig rek nemen onderaan.', alternatives: ['ex_cable_curl', 'ex_incline_db_curl'] },
    { id: 'ex_cable_reverse_curl', name: 'Cable Reverse Curl', category: 'Isolation', primaryMuscle: 'Forearms (brachioradialis)', secondaryMuscles: ['Biceps'], equipment: 'Cable machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Stand at a low cable pulley with a straight bar. Grip overhand (palms down), curl the bar up to shoulder height, keeping elbows at the sides.', cues: 'Elbows stay fixed. Full extension at the bottom.', mistakes: 'Letting elbows drift forward, using shoulder momentum.', alternatives: ['ex_db_wrist_curl'] },

    // ── Rope & EZ bar additions ───────────────────────────────────────────
    { id: 'ex_rope_tricep_pushdown', name: 'Rope Tricep Pushdown', category: 'Isolation', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Cable machine, rope', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Rope attachment on a high cable. Stand upright, elbows pinned at sides. Push both ends of the rope down and split them outward at the bottom for full extension. Return slowly.', cues: 'Split the rope at the bottom — that extra rotation fully contracts the triceps.', mistakes: 'Elbows drifting forward, not splitting the rope, rushing the return.', alternatives: ['ex_triceps_pushdown', 'ex_rope_overhead_ext'] },
    { id: 'ex_rope_overhead_ext', name: 'Rope Overhead Tricep Extension', category: 'Isolation', primaryMuscle: 'Triceps (long head)', secondaryMuscles: [], equipment: 'Cable machine, rope', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Rope on a low cable. Face away from the machine. Hold the rope behind your head, arms extended overhead. Lower by bending elbows, then extend back up.', cues: 'Elbows stay close to the head. Feel the stretch in the tricep long head at the bottom.', mistakes: 'Elbows flaring out, cutting the range short at the bottom.', alternatives: ['ex_ov_triceps_ext', 'ex_rope_tricep_pushdown'] },
    { id: 'ex_ez_bar_cable_curl', name: 'EZ Bar Cable Curl', category: 'Isolation', primaryMuscle: 'Biceps', secondaryMuscles: ['Brachialis'], equipment: 'Cable machine, EZ bar', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'EZ bar on a low cable. Stand upright, elbows at sides. Curl the bar to shoulder height under constant tension. Lower with control.', cues: 'Elbows stay fixed at the sides. Squeeze the bicep at the top.', mistakes: 'Swinging the torso, elbows drifting forward.', alternatives: ['ex_cable_curl', 'ex_incline_db_curl'] },
    { id: 'ex_db_hammer_curl', name: 'Dumbbell Hammer Curl', category: 'Isolation', primaryMuscle: 'Brachialis', secondaryMuscles: ['Biceps', 'Brachioradialis'], equipment: 'Dumbbells', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Stand with dumbbells at your sides, palms facing each other (neutral grip). Curl both dumbbells up while keeping the neutral wrist position throughout. Lower with control.', cues: 'Thumbs pointing up the whole time. Elbows stay at the sides.', mistakes: 'Rotating the wrist to supinate — that turns it into a regular curl, missing the brachialis.', alternatives: ['ex_incline_db_curl', 'ex_ez_bar_cable_curl'] },
    { id: 'ex_dips', name: 'Dips', category: 'Push', primaryMuscle: 'Chest (lower)', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: 'Dip bars', location: 'gym', type: 'compound', weightUnit: 'bodyweight', defaultReps: '6-12', defaultRir: '1-2', defaultRest: 90, instructions: 'Support yourself on dip bars with arms extended. Lower your body by bending the elbows until the upper arms are roughly parallel with the floor. Press back up to full extension.', cues: 'Lean slightly forward to shift emphasis to the chest. Keep elbows at roughly 45° from the body.', mistakes: 'Going too deep and stressing the shoulder joint, not reaching full extension at the top.', alternatives: ['ex_flat_db_bench', 'ex_incline_bb_bench'] },

    // Cardio
    { id: 'ex_cardio_session', name: 'Cardio Session', category: 'Cardio', primaryMuscle: 'Cardiovascular', secondaryMuscles: [], equipment: 'Various', location: 'both', type: 'cardio', weightUnit: 'bodyweight', defaultReps: '45-75 min', defaultRest: 0, instructions: 'Cycling, swimming, easy running, walking with incline, or freestyle cardio — mainly zone 2.', cues: 'Not fully exhausting.', mistakes: 'Too high intensity that impairs strength recovery.', alternatives: [] },
  ];

  exercises.forEach(e => { e.status = e.status || 'active'; });

  // ---- Gym workout templates (PPL) --------------------------------------
  // method: 'intensity' | 'volume' — for UI colour coding
  const gymTemplates = [
    {
      id: 'gym_push', type: 'gym', day: 'push', name: 'Push — Chest · Shoulders · Triceps',
      focus: ['Chest', 'Shoulders', 'Triceps', 'Intensity + volume method'],
      exercises: [
        // Intensity compound
        { exerciseId: 'ex_incline_bb_bench', sets: 3, repsMin: 6, repsMax: 8, rir: '1-2', restSec: 150, essential: true, method: 'intensity' },
        // Volume compound
        { exerciseId: 'ex_flat_db_bench', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true, method: 'volume' },
        // Shoulder intensity
        { exerciseId: 'ex_ohp', sets: 3, repsMin: 5, repsMax: 8, rir: '1-2', restSec: 150, essential: true, method: 'intensity' },
        // Lateral delts volume
        { exerciseId: 'ex_lateral_raise', sets: 3, repsMin: 12, repsMax: 20, rir: '0-2', restSec: 60, essential: true, method: 'volume' },
        // Chest/triceps compound (optional — heavy pressing already done above)
        { exerciseId: 'ex_dips', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 90, essential: false, method: 'volume' },
        // Triceps isolation
        { exerciseId: 'ex_rope_tricep_pushdown', sets: 3, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_rope_overhead_ext', sets: 3, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
      ]
    },
    {
      id: 'gym_pull', type: 'gym', day: 'pull', name: 'Pull — Back · Biceps · Rear Delts',
      focus: ['Lats', 'Upper back', 'Biceps', 'Rear delts'],
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
        { exerciseId: 'ex_ez_bar_cable_curl', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_db_hammer_curl', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_cable_curl_face_away', sets: 2, repsMin: 12, repsMax: 15, rir: '0-1', restSec: 60, essential: false, method: 'volume', note: 'Per arm' },
      ]
    },
    {
      id: 'gym_legs', type: 'gym', day: 'legs', name: 'Legs — Quads · Hamstrings · Glutes · Calves',
      focus: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
      exercises: [
        // Warm-up (5 min mobility — no set tracking)
        { exerciseId: 'ex_warmup_legs', sets: 1, repsMin: 0, repsMax: 0, rir: null, restSec: 0, essential: true, method: 'warmup', warmup: true },
        // ── QUADRICEPS — COMPOUND ─────────────────────────────────────────
        // Back Squat 5×10 · 2-3 RIR · rest 2-3 min
        { exerciseId: 'ex_back_squat', sets: 5, repsMin: 10, repsMax: 10, rir: '2-3', restSec: 150, essential: true, method: 'volume' },
        // Leg Press 4×12 · 2-3 RIR · rest 2 min
        { exerciseId: 'ex_leg_press', sets: 4, repsMin: 12, repsMax: 12, rir: '2-3', restSec: 120, essential: true, method: 'volume' },
        // Bulgarian Split Squat 3×10 per leg · 2-3 RIR · rest 2 min
        { exerciseId: 'ex_bulgarian_split_squat', sets: 3, repsMin: 10, repsMax: 10, rir: '2-3', restSec: 120, essential: true, method: 'volume' },
        // ── HAMSTRINGS & GLUTES — COMPOUND ───────────────────────────────
        // Romanian Deadlift 5×10 · 2-3 RIR · rest 2-3 min
        { exerciseId: 'ex_rdl', sets: 5, repsMin: 10, repsMax: 10, rir: '2-3', restSec: 150, essential: true, method: 'volume' },
        // Leg Curl 4×12 · 2-3 RIR · rest 1-2 min
        { exerciseId: 'ex_leg_curl', sets: 4, repsMin: 12, repsMax: 12, rir: '2-3', restSec: 90, essential: true, method: 'volume' },
        // Nordic Hamstring Curl 3×8 · controlled · rest 2 min
        { exerciseId: 'ex_nordic_curl', sets: 3, repsMin: 8, repsMax: 8, rir: '–', restSec: 120, essential: true, method: 'volume' },
        // Hip Thrust 4×12 · 2-3 RIR · rest 1-2 min
        { exerciseId: 'ex_hip_thrust', sets: 4, repsMin: 12, repsMax: 12, rir: '2-3', restSec: 90, essential: true, method: 'volume' },
        // ── CALVES — 3 VARIANTS ──────────────────────────────────────────
        // Standing Calf Raise 4×15 · 2-3 RIR · rest 1 min
        { exerciseId: 'ex_standing_calf_raise', sets: 4, repsMin: 15, repsMax: 15, rir: '2-3', restSec: 60, essential: true, method: 'volume' },
        // Seated Calf Raise 4×20 · 2-3 RIR · rest 1 min
        { exerciseId: 'ex_seated_calf_raise', sets: 4, repsMin: 20, repsMax: 20, rir: '2-3', restSec: 60, essential: true, method: 'volume' },
        // Single-leg Calf Raise 3×12 per leg · controlled · rest 1 min
        { exerciseId: 'ex_sl_calf_raise', sets: 3, repsMin: 12, repsMax: 12, rir: '–', restSec: 60, essential: false, method: 'volume' },
        // ── FOREARMS ─────────────────────────────────────────────────────
        { exerciseId: 'ex_db_wrist_curl',       sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_db_wrist_ext',        sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 60, essential: false, method: 'volume' },
        { exerciseId: 'ex_cable_reverse_curl',  sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 60, essential: false, method: 'volume' },
      ]
    },
  ];

  // ---- Legs 80% variant (shorter / efficient session) ------------------
  gymTemplates.push({
    id: 'gym_legs_80', type: 'gym', day: 'legs', variant: '80',
    name: 'Legs 80% — Efficient',
    focus: ['Quadriceps', 'Hamstrings', 'Calves', 'Abs'],
    exercises: [
      // Warm-up: 2 build-up sets on hack squat / leg press
      { exerciseId: 'ex_warmup_legs_80', sets: 1, repsMin: 0, repsMax: 0, rir: null, restSec: 0, essential: true, method: 'warmup', warmup: true },
      // ── QUAD COMPOUND ────────────────────────────────────────────────────
      { exerciseId: 'ex_hack_squat', sets: 4, repsMin: 6, repsMax: 10, rir: '1-2', restSec: 120, essential: true, method: 'intensity', note: 'Or Leg Press' },
      // ── HAMSTRINGS ───────────────────────────────────────────────────────
      { exerciseId: 'ex_rdl', sets: 3, repsMin: 8, repsMax: 10, rir: '1-2', restSec: 90, essential: true, method: 'volume' },
      // ── SUPERSET: Leg Extension + Leg Curl ───────────────────────────────
      { exerciseId: 'ex_leg_extension', sets: 3, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 0, essential: true, method: 'volume', supersetGroup: 'ss1', note: '↕ Superset — go straight to Leg Curl' },
      { exerciseId: 'ex_leg_curl', sets: 3, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: true, method: 'volume', supersetGroup: 'ss1', note: '60 sec rest after this superset' },
      // ── CALVES ───────────────────────────────────────────────────────────
      { exerciseId: 'ex_standing_calf_raise', sets: 3, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 50, essential: true, method: 'volume', note: '45–60 sec rest' },
      // ── ABS CIRCUIT (3 rounds) ────────────────────────────────────────────
      { exerciseId: 'ex_cable_crunch', sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 0, essential: false, method: 'volume', circuitGroup: 'abs', note: 'Abs circuit 1/3 — no rest, go to Hanging Knee Raise' },
      { exerciseId: 'ex_hanging_knee_raise', sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 0, essential: false, method: 'volume', circuitGroup: 'abs', note: 'Abs circuit 2/3 — no rest, go to Pallof Press' },
      { exerciseId: 'ex_pallof_press', sets: 3, repsMin: 10, repsMax: 10, rir: '1-2', restSec: 40, essential: false, method: 'volume', circuitGroup: 'abs', note: 'Abs circuit 3/3 — 30–45 sec rest between rounds' },
      // ── FOREARMS ─────────────────────────────────────────────────────────
      { exerciseId: 'ex_db_wrist_curl',       sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 60, essential: false, method: 'volume' },
      { exerciseId: 'ex_db_wrist_ext',        sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 60, essential: false, method: 'volume' },
      { exerciseId: 'ex_cable_reverse_curl',  sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 60, essential: false, method: 'volume' },
    ],
  });

  // ---- TRX templates (home / alternative workouts) ---------------------
  gymTemplates.push({
    id: 'trx_upper', type: 'gym', day: 'trxUpper',
    name: 'TRX Upper Body',
    focus: ['Back', 'Chest', 'Shoulders', 'Arms', 'Core'],
    exercises: [
      { exerciseId: 'ex_warmup_trx', sets: 1, repsMin: 0, repsMax: 0, rir: null, restSec: 0, essential: true, method: 'warmup', warmup: true },
      { exerciseId: 'ex_trx_low_row',        sets: 2, repsMin: 6,  repsMax: 10, rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_chest_press',    sets: 2, repsMin: 6,  repsMax: 10, rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_face_pull',      sets: 2, repsMin: 8,  repsMax: 10, rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_flys',           sets: 2, repsMin: 6,  repsMax: 10, rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_y_raise',        sets: 2, repsMin: 8,  repsMax: 10, rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_triceps_ext',    sets: 2, repsMin: 8,  repsMax: 8,  rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_bicep_curl',     sets: 2, repsMin: 8,  repsMax: 8,  rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_abs_crunch',     sets: 2, repsMin: 8,  repsMax: 12, rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_front_back_squeeze', sets: 2, repsMin: 8, repsMax: 8, rir: null, restSec: 15, essential: true, method: 'volume', note: '8 s hold per side · 15 s rest' },
    ],
  });

  gymTemplates.push({
    id: 'trx_lower', type: 'gym', day: 'trxLower',
    name: 'TRX Lower Body',
    focus: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    exercises: [
      { exerciseId: 'ex_warmup_trx', sets: 1, repsMin: 0, repsMax: 0, rir: null, restSec: 0, essential: true, method: 'warmup', warmup: true },
      { exerciseId: 'ex_trx_squat_calf_raise', sets: 2, repsMin: 8,  repsMax: 10, rir: '1-2', restSec: 60, essential: true, method: 'volume', note: '2 s pause at bottom' },
      { exerciseId: 'ex_trx_hip_thrust',       sets: 2, repsMin: 6,  repsMax: 6,  rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_reverse_lunge',    sets: 2, repsMin: 10, repsMax: 10, rir: '1-2', restSec: 60, essential: true, method: 'volume', note: '10 reps per leg' },
      { exerciseId: 'ex_trx_hamstring_curl',   sets: 2, repsMin: 8,  repsMax: 8,  rir: '1-2', restSec: 60, essential: true, method: 'volume' },
      { exerciseId: 'ex_trx_squat_25',         sets: 1, repsMin: 25, repsMax: 25, rir: '0',   restSec: 60, essential: true, method: 'volume', note: 'Pause at failure — continue until 25 total reps' },
      { exerciseId: 'ex_trx_squeeze_quads',    sets: 2, repsMin: 8,  repsMax: 8,  rir: null,  restSec: 15, essential: true, method: 'volume', note: '8 s hold · 15 s rest' },
      { exerciseId: 'ex_trx_squeeze_hams',     sets: 2, repsMin: 8,  repsMax: 8,  rir: null,  restSec: 15, essential: true, method: 'volume', note: '8 s hold · 15 s rest' },
      { exerciseId: 'ex_cooldown_trx', sets: 1, repsMin: 0, repsMax: 0, rir: null, restSec: 0, essential: true, method: 'warmup', warmup: true },
    ],
  });

  // ---- Full Body template (~60 min, alle spiergroepen) ------------------
  gymTemplates.push({
    id: 'gym_fullbody', type: 'gym', day: 'fullBody',
    name: 'Full Body — Alle Spiergroepen',
    focus: ['Quadriceps', 'Hamstrings', 'Chest', 'Back', 'Shoulders', 'Core', 'Forearms'],
    exercises: [
      // Warm-up (5 min)
      { exerciseId: 'ex_warmup_fullbody', sets: 1, repsMin: 0, repsMax: 0, rir: null, restSec: 0, essential: true, method: 'warmup', warmup: true },

      // ── BENEN — compound eerst (meeste energie nodig) ────────────────────
      // Back Squat 2×8-10 · 2-3 RIR · 2 min rust
      { exerciseId: 'ex_back_squat',          sets: 2, repsMin: 8,  repsMax: 10, rir: '2-3', restSec: 120, essential: true, method: 'intensity' },
      // Romanian Deadlift 2×10 · 2-3 RIR · 90s rust
      { exerciseId: 'ex_rdl',                 sets: 2, repsMin: 10, repsMax: 10, rir: '2-3', restSec: 90,  essential: true, method: 'volume' },

      // ── BOVENKANT — push & pull gecombineerd ─────────────────────────────
      // Incline DB Bench Press 2×8-10 · 1-2 RIR · 90s rust
      { exerciseId: 'ex_incline_db_bench',    sets: 2, repsMin: 8,  repsMax: 10, rir: '1-2', restSec: 90,  essential: true, method: 'intensity' },
      // Chest Supported Row 2×8-10 · 1-2 RIR · 90s rust
      { exerciseId: 'ex_chest_supported_row', sets: 2, repsMin: 8,  repsMax: 10, rir: '1-2', restSec: 90,  essential: true, method: 'intensity' },
      // DB Shoulder Press 2×10-12 · 1-2 RIR · 75s rust
      { exerciseId: 'ex_db_shoulder_press',   sets: 2, repsMin: 10, repsMax: 12, rir: '1-2', restSec: 75,  essential: true, method: 'volume' },

      // ── ISOLATIE — bijwerken wat de compounds gemist hebben ───────────────
      // Rope Tricep Pushdown 2×12-15 · 0-1 RIR · 60s rust
      { exerciseId: 'ex_rope_tricep_pushdown', sets: 2, repsMin: 12, repsMax: 15, rir: '0-1', restSec: 60, essential: true, method: 'volume' },
      // Single Arm Face Away Cable Curl 2×12-15 · 0-1 RIR · 60s rust
      { exerciseId: 'ex_cable_curl_face_away', sets: 2, repsMin: 12, repsMax: 15, rir: '0-1', restSec: 60, essential: true, method: 'volume', note: 'Per arm' },
      // Leg Curl 2×12 · 1-2 RIR · 60s rust
      { exerciseId: 'ex_leg_curl',            sets: 2, repsMin: 12, repsMax: 12, rir: '1-2', restSec: 60,  essential: true, method: 'volume' },
      // Lateral Raise 2×15 · 1-2 RIR · 60s rust
      { exerciseId: 'ex_lateral_raise',       sets: 2, repsMin: 15, repsMax: 15, rir: '1-2', restSec: 60,  essential: true, method: 'volume' },
      // Standing Calf Raise 2×15 · 0-1 RIR · 60s rust
      { exerciseId: 'ex_standing_calf_raise', sets: 2, repsMin: 15, repsMax: 15, rir: '0-1', restSec: 60,  essential: true, method: 'volume' },
      // Cable Crunch 2×12 · 1-2 RIR · 60s rust
      { exerciseId: 'ex_cable_crunch',        sets: 2, repsMin: 12, repsMax: 15, rir: '1-2', restSec: 60,  essential: true, method: 'volume' },

      // ── ONDERARMEN ────────────────────────────────────────────────────────
      // Cable Reverse Curl 2×12-15 · 60s rust
      { exerciseId: 'ex_cable_reverse_curl',  sets: 2, repsMin: 12, repsMax: 15, rir: '1-2', restSec: 60,  essential: false, method: 'volume' },

      // ── FINISHER — Assisted Pull-up Dropset ──────────────────────────────
      { exerciseId: 'ex_assisted_pullup', sets: 4, repsMin: 8, repsMax: 12, rir: '0', restSec: 20, essential: true, method: 'volume', note: 'Dropset — elke set tot failure, verlaag gewicht direct na elke set · ~20 s wisselen' },
    ],
  });

  // ---- Kettlebell templates (standalone KB days) ------------------------
  // These are NOT alternatives to gym days — they ARE the day.
  const kettlebellTemplates = [
    {
      id: 'kb_upper_std', type: 'kettlebell', day: 'kbUpper', variant: 'standard',
      name: 'KB Upper — Strength & Stability',
      durationMin: 30,
      items: [
        // Warmup
        { exerciseId: 'kb_halo', reps: '8 per side', note: 'Warm-up' },
        // Ballistic power
        { exerciseId: 'kb_snatch', reps: 'Max per arm', sets: 3, note: 'Explosive' },
        // Anti-rotation pull
        { exerciseId: 'kb_renegade_row', reps: 'Max per arm', sets: 3, note: 'Core tight' },
        // Lateral chain / overhead stability
        { exerciseId: 'kb_windmill', reps: 'Max per side', sets: 3, note: 'Slow and controlled' },
      ]
    },
    {
      id: 'kb_lower_std', type: 'kettlebell', day: 'kbLower', variant: 'standard',
      name: 'KB Lower — Hip Power & Balance',
      durationMin: 30,
      items: [
        // Warmup via goblet squat warmup protocol (light)
        { exerciseId: 'kb_goblet_squat', reps: '12', sets: 3, note: 'Warm-up with lighter KB' },
        // Hip hinge power
        { exerciseId: 'kb_russian_swing', reps: '15', sets: 4, note: 'Hardstyle — explosive' },
        // Unilateral balance
        { exerciseId: 'kb_sl_rdl', reps: '8 per leg', sets: 3, note: 'Controlled' },
        // Calves
        { exerciseId: 'kb_calf_raise', reps: '15', sets: 3, note: 'Full range' },
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
