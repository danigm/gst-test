#pragma once

#include <glib.h>
#include <gio/gio.h>
#include <glib-object.h>

G_BEGIN_DECLS

GObject *
lib_property_get_object(GObject *obj, const gchar *property);

void
lib_property_set_object(GObject *obj, const gchar *property, gpointer value);

G_END_DECLS
