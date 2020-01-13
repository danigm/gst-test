#include "lib.h"

/**
 * lib_property_get_object:
 * @obj: The parent object
 * @property: The property name
 *
 * Gets an object property from an object. This is a workaround to get
 * the playbin widget in javascript because the direct access in gjs is not
 * working since org.gnome.Platform//2.28
 *
 * Returns: (transfer full): a #GObject
 */
GObject *
lib_property_get_object (GObject *obj,
                         const gchar *property)
{
  GObject *retval = NULL;
  g_object_get (obj, property, &retval, NULL);
  return retval;
}

/**
 * lib_property_set_object:
 * @obj: The parent object
 * @property: The property name
 * @value: The new value for the property
 *
 * Sets an object property. This is a workaround to get
 * the playbin widget in javascript because the direct access in gjs is not
 * working since org.gnome.Platform//2.28
 */
void
lib_property_set_object(GObject *obj,
                        const gchar *property,
                        gpointer value)
{
  g_object_set (obj, property, value, NULL);
}
