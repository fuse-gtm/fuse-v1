import { FieldMetadataType } from 'twenty-shared/types';

import { PARTNER_OS_OBJECT_SCHEMAS } from 'src/modules/partner-os/constants/partner-os-schema.constant';

const STANDARD_TWENTY_OBJECTS = [
  'company',
  'person',
  'opportunity',
  'workspaceMember',
];

describe('PARTNER_OS_OBJECT_SCHEMAS', () => {
  describe('structural integrity', () => {
    it('should contain exactly 16 object definitions', () => {
      expect(PARTNER_OS_OBJECT_SCHEMAS).toHaveLength(16);
    });

    it('should have unique nameSingular values', () => {
      const names = PARTNER_OS_OBJECT_SCHEMAS.map(
        (schema) => schema.object.nameSingular,
      );

      expect(new Set(names).size).toBe(names.length);
    });

    it('should have unique namePlural values', () => {
      const names = PARTNER_OS_OBJECT_SCHEMAS.map(
        (schema) => schema.object.namePlural,
      );

      expect(new Set(names).size).toBe(names.length);
    });
  });

  describe('field uniqueness', () => {
    const testCases = PARTNER_OS_OBJECT_SCHEMAS.map((schema) => ({
      objectName: schema.object.nameSingular,
      fields: schema.fields,
    }));

    it.each(testCases)(
      'should have no duplicate field names on $objectName',
      ({ fields }) => {
        const names = fields.map((field) => field.name);

        expect(new Set(names).size).toBe(names.length);
      },
    );
  });

  describe('relation targets', () => {
    it('should reference existing schemas or standard Twenty objects for all relation targets', () => {
      const partnerOsObjectNames = new Set(
        PARTNER_OS_OBJECT_SCHEMAS.map((schema) => schema.object.nameSingular),
      );

      const validTargets = new Set([
        ...partnerOsObjectNames,
        ...STANDARD_TWENTY_OBJECTS,
      ]);

      for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
        for (const relation of schema.relations) {
          expect(validTargets).toContain(relation.targetObjectName);
        }
      }
    });

    it('should have non-empty label and icon on every relation', () => {
      for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
        for (const relation of schema.relations) {
          expect(relation.label.length).toBeGreaterThan(0);
          expect(relation.icon.length).toBeGreaterThan(0);
          expect(relation.targetFieldLabel.length).toBeGreaterThan(0);
          expect(relation.targetFieldIcon.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('view field references', () => {
    it('should reference an existing SELECT field when kanbanFieldName is defined', () => {
      const schemasWithKanban = PARTNER_OS_OBJECT_SCHEMAS.filter(
        (schema) => schema.kanbanFieldName !== undefined,
      );

      expect(schemasWithKanban.length).toBeGreaterThan(0);

      for (const schema of schemasWithKanban) {
        const kanbanField = schema.fields.find(
          (field) => field.name === schema.kanbanFieldName,
        );

        expect(kanbanField).toBeDefined();
        expect(kanbanField?.type).toBe(FieldMetadataType.SELECT);
      }
    });

    it('should reference an existing DATE or DATE_TIME field when calendarFieldName is defined', () => {
      const schemasWithCalendar = PARTNER_OS_OBJECT_SCHEMAS.filter(
        (schema) => schema.calendarFieldName !== undefined,
      );

      expect(schemasWithCalendar.length).toBeGreaterThan(0);

      for (const schema of schemasWithCalendar) {
        const calendarField = schema.fields.find(
          (field) => field.name === schema.calendarFieldName,
        );

        expect(calendarField).toBeDefined();
        expect([FieldMetadataType.DATE, FieldMetadataType.DATE_TIME]).toContain(
          calendarField?.type,
        );
      }
    });
  });

  describe('field definitions', () => {
    it('should have label and icon on every field', () => {
      for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
        for (const field of schema.fields) {
          expect(field.label.length).toBeGreaterThan(0);
          expect(field.icon).toBeDefined();
          expect(field.icon!.length).toBeGreaterThan(0);
        }
      }
    });

    it('should have a non-empty options array on every SELECT field', () => {
      for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
        const selectFields = schema.fields.filter(
          (field) => field.type === FieldMetadataType.SELECT,
        );

        for (const field of selectFields) {
          expect(field.options).toBeDefined();
          expect(field.options!.length).toBeGreaterThan(0);
        }
      }
    });

    it('should have unique option values within each SELECT field', () => {
      for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
        const selectFields = schema.fields.filter(
          (field) => field.type === FieldMetadataType.SELECT,
        );

        for (const field of selectFields) {
          const values = field.options!.map(
            (option: { value: string }) => option.value,
          );

          expect(new Set(values).size).toBe(values.length);
        }
      }
    });
  });

  describe('object definitions', () => {
    it('should have label, description, and icon on every object', () => {
      for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
        expect(schema.object.labelSingular.length).toBeGreaterThan(0);
        expect(schema.object.labelPlural.length).toBeGreaterThan(0);
        expect(schema.object.description).toBeDefined();
        expect(schema.object.description!.length).toBeGreaterThan(0);
        expect(schema.object.icon).toBeDefined();
        expect(schema.object.icon!.length).toBeGreaterThan(0);
      }
    });

    it('should set isRemote to false on all objects', () => {
      for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
        expect(schema.object.isRemote).toBe(false);
      }
    });
  });
});
