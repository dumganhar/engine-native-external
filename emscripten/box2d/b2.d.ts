declare namespace B2 {
    const maxPolygonVertices: number;

    interface Vec2 {
        x: number, y: number
    }

    interface Vec2Vector {
        push_back(v: Vec2): void;
        get(i: number): Vec2;
        size(): number;
    }

    interface Int32Vector {
        push_back(v: number): void;
        get(i: number): number;
        size(): number;
    }

    interface Transform {
        p: Vec2, q: Vec2
    }

    interface Color {
        r: number, g: number, b: number, a: number
    }

    interface MassData {
        mass: number;
        center: Vec2;
        I: number;
    }

    class AABB {
        constructor();
        lowerBound: Vec2;
        upperBound: Vec2;
        IsValid(): boolean;
        GetCenter(): Vec2;
        GetExtents(): Vec2;
        GetPerimeter(): number;
        Combine(aabb: AABB): void;
        CombineTwo(aabb1: AABB, aabb2: AABB): void;
        Contains(aabb: AABB): boolean;
        RayCast(output: RayCastOutput, input: RayCastInput): boolean;
        TestOverlap(other: AABB): boolean;
    }

    class RayCastCallback {
        constructor();
        ReportFixture(fixture: Fixture, point: Vec2, normal: Vec2, fraction: number): number;
    }

    class QueryCallback {
        constructor();
        ReportFixture(fixture: Fixture): boolean;
    }

    interface RayCastInput {
        p1: Vec2;
        p2: Vec2;
        maxFraction: number;
    }

    interface RayCastOutput {
        normal: Vec2;
        fraction: number;
    }

    interface Filter {
        categoryBits: number;
        maskBits: number;
        groupIndex: number;
    }

    class ContactListener {
        constructor();
        BeginContact(contact: number): void;
        EndContact(contact: number): void;
        PreSolve(contact: number, oldManifold: number): void;
        PostSolve(contact: number, impulse: number): void;
        registerContactFixture(fixture: number): void;
        unregisterContactFixture(fixture: number): void;
        isIndexOf(fixture: number): void;
    }

    class Draw {
        constructor();
        SetFlags(flags: number): void;
        GetFlags(): number;
        AppendFlags(flags: number): void;
        ClearFlags(flags: number): void;
        DrawPolygon(vertices: Vec2[], vertexCount: number, color: Color): void;
        DrawSolidPolygon(vertices: Vec2[], vertexCount: number, color: Color): void;
        DrawCircle(center: Vec2, radius: number, color: Color): void;
        DrawSolidCircle(center: Vec2, radius: number, axis: Vec2, color: Color): void;
    }

    class World {
        constructor(gravity: Vec2);
        SetContactListener(listener: ContactListener): void;
        SetDebugDraw(debugDraw: Draw): void;
        CreateBody(def: BodyDef): Body;
        DestroyBody(body: Body): void;
        CreateJoint(def: JointDef): Joint;
        DestroyJoint(joint: Joint): void;
        Step(timeStep: number, velocityIterations: number, positionIterations: number): void;
        DebugDraw(): void;
        QueryAABB(callback: QueryCallback, aabb: AABB): void;
        RayCast(callback: RayCastCallback, point1: Vec2, point2: Vec2): void;
        SetAllowSleeping(flag: boolean): void;
        GetAllowSleeping(): boolean;
        SetGravity(gravity: Vec2): void;
        GetGravity(): Vec2;
        Dump(): void;
    }

    class Shape {
        m_type: number;
        m_radius: number;
        GetType(): number;
        GetChildCount(): number;
        TestPoint(xf: Transform, p: Vec2): boolean;
        RayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        ComputeAABB(aabb: AABB, xf: Transform, childIndex: number): void;
        ComputeMass(massData: MassData, density: number): void;
        SetRadius(radius: number): void;
        GetRadius(): number;
    }

    class CircleShape extends Shape {
        constructor();
        m_p: Vec2;
        Clone(): CircleShape;
        GetChildCount(): number;
        TestPoint(transform: Transform, p: Vec2): boolean;
        RayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        ComputeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        ComputeMass(massData: MassData, density: number): void;
    }

    class EdgeShape extends Shape {
        constructor();
        Set(v1: Vec2, v2: Vec2): void;
        Clone(): EdgeShape;
        GetChildCount(): number;
        TestPoint(transform: Transform, p: Vec2): boolean;
        RayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        ComputeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        ComputeMass(massData: MassData, density: number): void;
    }

    class PolygonShape extends Shape {
        constructor();
        Clone(): PolygonShape;
        Set(vertices: any, count: number): void;
        SetAsBox(hx: number, hy: number): void;
        SetAsBoxWithCenterAndAngle(hx: number, hy: number, center: Vec2, angle: number): void;
        GetChildCount(): number;
        TestPoint(transform: Transform, p: Vec2): boolean;
        RayCast(output: RayCastOutput, input: RayCastInput, transform: Transform, childIndex: number): boolean;
        ComputeAABB(aabb: AABB, transform: Transform, childIndex: number): void;
        ComputeMass(massData: MassData, density: number): void;
        Validate(): boolean;
    }

    class FixtureDef {
        shape: Shape;
        userData: any;
        friction: number;
        restitution: number;
        density: number;
        isSensor: boolean;
        filter: Filter;
        SetShape(shape: Shape): void;
        GetShape(): Shape;
    }

    class Fixture {
        GetType(): number;
        GetShape(): Shape;
        SetSensor(sensor: boolean): void;
        IsSensor(): boolean;
        SetFilterData(filter: Filter): void;
        GetFilterData(): Filter;
        Refilter(): void;
        GetBody(): Body;
        TestPoint(p: Vec2): boolean;
        RayCast(output: RayCastOutput, input: RayCastInput, childIndex: number): boolean;
        GetMassData(massData: MassData): void;
        SetDensity(density: number): void;
        GetDensity(): number;
        GetFriction(): number;
        SetFriction(friction: number): void;
        GetRestitution(): number;
        SetRestitution(restitution: number): void;
        GetAABB(childIndex: number): AABB;
        Dump(bodyIndex: number): void;
    }

    enum BodyType{
        b2_staticBody = 0,
        b2_kinematicBody,
        b2_dynamicBody,
        cc_animatedBody,
    }

    class BodyDef {
        constructor();
        type: BodyType;
        position: Vec2;
        angle: number;
        linearVelocity: Vec2;
        angularVelocity: number;
        linearDamping: number;
        angularDamping: number;
        allowSleep: boolean;
        awake: boolean;
        fixedRotation: boolean;
        bullet: boolean;
        gravityScale: number;
    }

    class Body {
        CreateFixture (fixtureDef: FixtureDef): Fixture;
        CreateFixtureWithShape (shape: Shape, density: number): Fixture;
        DestroyFixture(fixture: Fixture): void;
        SetTransform(position: Vec2, angle: number): void;
        GetTransform(): Transform;
        GetPosition(): Vec2;
        SetPosition(pos: Vec2): void;
        GetAngle(): number;
        SetAngle(angle: number): void;
        GetWorldCenter(): Vec2;
        GetLocalCenter(): Vec2;
        SetLinearVelocity(v: Vec2): void;
        GetLinearVelocity(): Vec2;
        SetAngularVelocity(omega: number): void;
        GetAngularVelocity(): number;
        ApplyForce(force: Vec2, point: Vec2, wake: boolean): void;
        ApplyForceToCenter(force: Vec2, wake: boolean): void;
        ApplyTorque(torque: number, wake: boolean): void;
        ApplyLinearImpulse(impulse: Vec2, point: Vec2, wake: boolean): void;
        ApplyLinearImpulseToCenter(impulse: Vec2, wake: boolean): void;
        ApplyAngularImpulse(impulse: number, wake: boolean): void;
        GetMass(): number;
        GetInertia(): number;
        GetMassData(data: MassData): void;
        SetMassData(data: MassData): void;
        ResetMassData(): void;
        GetWorldPoint(localPoint: Vec2): Vec2;
        GetWorldVector(localVector: Vec2): Vec2;
        GetLocalPoint(worldPoint: Vec2): Vec2;
        GetLocalVector(worldVector: Vec2): Vec2;
        GetLinearVelocityFromWorldPoint(worldPoint: Vec2): Vec2;
        GetLinearVelocityFromLocalPoint(localPoint: Vec2): Vec2;
        GetLinearDamping(): number;
        SetLinearDamping(linearDamping: number): void;
        GetAngularDamping(): number;
        SetAngularDamping(angularDamping: number): void;
        GetGravityScale(): number;
        SetGravityScale(scale: number): void;
        SetType(type: BodyType): void;
        GetType(): BodyType;
        SetBullet(flag: boolean): void;
        IsBullet(): boolean;
        SetSleepingAllowed(flag: boolean): void;
        IsSleepingAllowed(): boolean;
        SetAwake(flag: boolean): void;
        IsAwake(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        SetFixedRotation(flag: boolean): void;
        IsFixedRotation(): boolean;
        GetWorld(): World;
        Dump(): void;
    }

    enum JointType {
        e_unknownJoint,
        e_revoluteJoint,
        e_prismaticJoint,
        e_distanceJoint,
        e_pulleyJoint,
        e_mouseJoint,
        e_gearJoint,
        e_wheelJoint,
        e_weldJoint,
        e_frictionJoint,
        e_ropeJoint,
        e_motorJoint
    }

    class JointDef {
        constructor(type: JointType);
        type: JointType;
        collideConnected: boolean;
        SetBodyA(bodyA: Body): void;
        SetBodyB(bodyB: Body): void;
        GetBodyA(): Body;
        GetBodyB(): Body;
        SetCollideConnected(flag: boolean): void;
    }

    class Joint {
        GetType(): JointType;
        GetBodyA(): Body;
        GetBodyB(): Body;
        GetAnchorA(): Vec2;
        GetAnchorB(): Vec2;
        GetReactionForce(inv_dt: number): Vec2;
        GetReactionTorque(inv_dt: number): number;
        IsActive(): boolean;
        GetCollideConnected(): boolean;
        Dump(): void;
    }

    class DistanceJointDef extends JointDef {
        constructor();
        localAnchorA: Vec2;
        localAnchorB: Vec2;
        length: number;
        stiffness: number;
        damping: number;
    }

    class DistanceJoint extends Joint {
        GetLocalAnchorA(): Vec2;
        GetLocalAnchorB(): Vec2;
        SetLength(length: number): void;
        GetLength(): number;
        SetStiffness(stiffness: number): void;
        GetStiffness(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
        Dump(): void;
    }

    class MotorJointDef extends JointDef {
        constructor();
        linearOffset: Vec2;
        angularOffset: number;
        maxForce: number;
        maxTorque: number;
        correctionFactor: number;
    }

    class MotorJoint extends Joint {
        SetLinearOffset(linearOffset: Vec2): void;
        GetLinearOffset(): Vec2;
        SetAngularOffset(angularOffset: number): void;
        GetAngularOffset(): number;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        SetCorrectionFactor(factor: number): void;
        GetCorrectionFactor(): number;
        Dump(): void;
    }

    class MouseJointDef extends JointDef {
        constructor();
        target: Vec2;
        maxForce: number;
        frequencyHz: number;
        dampingRatio: number;
    }

    class MouseJoint extends Joint {
        SetTarget(target: Vec2): void;
        GetTarget(): Vec2;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(): void;
    }

    class PrismaticJointDef extends JointDef {
        constructor();
        localAnchorA: Vec2;
        localAnchorB: Vec2;
        localAxisA: Vec2;
        referenceAngle: number;
        enableLimit: boolean;
        lowerTranslation: number;
        upperTranslation: number;
        enableMotor: boolean;
        maxMotorForce: number;
        motorSpeed: number;
    }

    class PrismaticJoint extends Joint {
        GetLocalAnchorA(): Vec2;
        GetLocalAnchorB(): Vec2;
        GetLocalAxisA(): Vec2;
        GetReferenceAngle(): number;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorForce(force: number): void;
        GetMaxMotorForce(): number;
        GetMotorForce(inv_dt: number): number;
        Dump(): void;
    }

    class RevoluteJointDef extends JointDef {
        constructor();
        localAnchorA: Vec2;
        localAnchorB: Vec2;
        referenceAngle: number;
        enableLimit: boolean;
        lowerAngle: number;
        upperAngle: number;
        enableMotor: boolean;
        motorSpeed: number;
        maxMotorTorque: number;
    }

    class RevoluteJoint extends Joint {
        GetLocalAnchorA(): Vec2;
        GetLocalAnchorB(): Vec2;
        GetReferenceAngle(): number;
        GetJointAngle(): number;
        GetJointSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: number): void;
        GetMaxMotorTorque(): number;
        GetMotorTorque(inv_dt: number): number;
        Dump(): void;
    }

    class RopeJointDef extends JointDef {
        constructor();
        localAnchorA: Vec2;
        localAnchorB: Vec2;
        maxLength: number;
    }

    class RopeJoint extends Joint {
        GetLocalAnchorA(): Vec2;
        GetLocalAnchorB(): Vec2;
        GetReactionForce(inv_dt: number): Vec2;
        GetReactionTorque(inv_dt: number): number;
        SetMaxLength(length: number): void;
        GetMaxLength(): number;
        GetLength(): number;
        Dump(): void;
    }

    class WeldJointDef extends JointDef {
        constructor();
        localAnchorA: Vec2;
        localAnchorB: Vec2;
        referenceAngle: number;
        stiffness: number;
        damping: number;
    }

    class WeldJoint extends Joint {
        GetLocalAnchorA(): Vec2;
        GetLocalAnchorB(): Vec2;
        GetReferenceAngle(): number;
        SetStiffness(stiffness: number): void;
        GetStiffness(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
        Dump(): void;
    }

    class WheelJointDef extends JointDef {
        constructor();
        localAnchorA: Vec2;
        localAnchorB: Vec2;
        localAxisA: Vec2;
        enableLimit: boolean;
        lowerTranslation: number;
        upperTranslation: number;
        enableMotor: boolean;
        maxMotorTorque: number;
        motorSpeed: number;
        stiffness: number;
        damping: number;
    }

    class WheelJoint extends Joint {
        GetLocalAnchorA(): Vec2;
        GetLocalAnchorB(): Vec2;
        GetLocalAxisA(): Vec2;
        GetJointTranslation(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: number): void;
        GetMaxMotorTorque(): number;
        GetMotorTorque(inv_dt: number): number;
        SetStiffness(stiffness: number): void;
        GetStiffness(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
        Dump(): void;
    }

    //
    // functions
    //
    function ConvexPartition(verticesIn: Vec2Vector, trianglesIn: Int32Vector, verticesOut: Vec2Vector, trianglesOut: Int32Vector): void;
    function GetFloat32(memory: number, offset: number): number;
    function SetLinearFrequencyAndDampingRatio(body: Joint, frequencyHertz: number, dampingRatio: number): void;

    //Contact
    function ContactSetEnabled(contactPtr: number, flag: boolean): void;
    function ContactIsTouching(contactPtr: number): boolean;
    function ContactSetTangentSpeed(contactPtr: number, speed: number): void;
    function ContactGetTangentSpeed(contactPtr: number): number;
    function ContactSetFriction(contactPtr: number, friction: number): void;
    function ContactGetFriction(contactPtr: number): number;
    function ContactResetFriction(contactPtr: number): void;
    function ContactSetRestitution(contactPtr: number, restitution: number): void;
    function ContactGetRestitution(contactPtr: number): number;
    function ContactResetRestitution(contactPtr: number): void;
    function ContactGetFixtureA(contactPtr: number): number;
    function ContactGetFixtureB(contactPtr: number): number;
    function ContactGetWorldManifold(contactPtr: number, worldManifoldPtr: number): number;
    function ContactGetManifold(contactPtr: number): number;

    //Manifold
    function ManifoldGetType(manifoldPtr: number): number;
    function ManifoldGetPointCount(manifoldPtr: number): number;
    function ManifoldGetManifoldPointPtr(manifoldPtr: number, index: number): number;
    function ManifoldGetLocalPointValueX(manifoldPtr: number): number;
    function ManifoldGetLocalPointValueY(manifoldPtr: number): number;
    function ManifoldGetLocalNormalValueX(manifoldPtr: number): number;
    function ManifoldGetLocalNormalValueY(manifoldPtr: number): number;

    //ManifoldPoint
    function ManifoldPointGetLocalPointX(manifoldPointPtr: number): number;
    function ManifoldPointGetLocalPointY(manifoldPointPtr: number): number;
    function ManifoldPointGetNormalImpulse(manifoldPointPtr: number): number;
    function ManifoldPointGetTangentImpulse(manifoldPointPtr: number): number;

    //WorldManifold
    function WorldManifoldNew(): number;
    function WorldManifoldGetPointValueX(worldManifoldPtr: number, index: number): number;
    function WorldManifoldGetPointValueY(worldManifoldPtr: number, index: number): number;
    function WorldManifoldGetSeparationValue(worldManifoldPtr: number, index: number): number;
    function WorldManifoldGetNormalValueX(worldManifoldPtr: number): number;
    function WorldManifoldGetNormalValueY(worldManifoldPtr: number): number;
    function WorldManifoldDelete(worldManifoldPtr: number): void;

    //ContactImpulse
    function ContactImpulseGetNormalImpulse(contactImpulsePtr: number, index: number): number;
    function ContactImpulseGetTangentImpulse(contactImpulsePtr: number, index: number): number;
    function ContactImpulseGetCount(contactImpulsePtr: number): number;
}